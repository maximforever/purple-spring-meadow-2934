import uuid

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.db import database
from backend.routes.companies import (
    CompanyBatchOutput,
    fetch_companies_with_liked,
)

router = APIRouter(
    prefix="/collections",
    tags=["collections"],
)


class CompanyCollectionMetadata(BaseModel):
    id: uuid.UUID
    collection_name: str


class CompanyCollectionOutput(CompanyBatchOutput, CompanyCollectionMetadata):
    pass


class CollectionUpdateResponse(BaseModel):
    success: bool
    message: str


class AddCompaniesRequest(BaseModel):
    company_ids: list[int]


@router.get("", response_model=list[CompanyCollectionMetadata])
def get_all_collection_metadata(
    db: Session = Depends(database.get_db),
):
    collections = db.query(database.CompanyCollection).all()

    return [
        CompanyCollectionMetadata(
            id=collection.id,
            collection_name=collection.collection_name,
        )
        for collection in collections
    ]


@router.get("/{collection_id}", response_model=CompanyCollectionOutput)
def get_company_collection_by_id(
    collection_id: uuid.UUID,
    offset: int = Query(
        0, description="The number of items to skip from the beginning"
    ),
    limit: int = Query(10, description="The number of items to fetch"),
    db: Session = Depends(database.get_db),
):
    query = (
        db.query(database.CompanyCollectionAssociation, database.Company)
        .join(database.Company)
        .filter(database.CompanyCollectionAssociation.collection_id == collection_id)
    )

    total_count = query.with_entities(func.count()).scalar()

    results = query.offset(offset).limit(limit).all()
    companies = fetch_companies_with_liked(db, [company.id for _, company in results])

    return CompanyCollectionOutput(
        id=collection_id,
        collection_name=db.query(database.CompanyCollection)
        .get(collection_id)
        .collection_name,
        companies=companies,
        total=total_count,
    )


@router.post("/{collection_id}/add-companies", response_model=CollectionUpdateResponse)
def add_companies_to_collection(
    collection_id: uuid.UUID,
    request: AddCompaniesRequest,
    db: Session = Depends(database.get_db),
):
    collection = db.query(database.CompanyCollection).get(collection_id)
    if not collection:
        return CollectionUpdateResponse(success=False, message="Collection not found")

    if collection.updating:
        return CollectionUpdateResponse(success=False, message="Collection is updating")

    # Set lock at the start
    collection.updating = True
    db.commit()

    try:
        existing_associations = (
            db.query(database.CompanyCollectionAssociation)
            .filter(
                database.CompanyCollectionAssociation.collection_id == collection_id,
                database.CompanyCollectionAssociation.company_id.in_(
                    request.company_ids
                ),
            )
            .all()
        )
        existing_company_ids = {assoc.company_id for assoc in existing_associations}

        # Only insert new companies
        new_company_ids = set(request.company_ids) - existing_company_ids

        if not new_company_ids:
            return CollectionUpdateResponse(
                success=True,
                message="All companies already in collection",
            )

        for company_id in new_company_ids:
            association = database.CompanyCollectionAssociation(
                collection_id=collection_id, company_id=company_id
            )
            db.add(association)

        db.commit()
        return CollectionUpdateResponse(
            success=True,
            message=f"Added {len(new_company_ids)} {'company' if len(new_company_ids) == 1 else 'companies'} to collection",
        )

    except Exception as e:
        db.rollback()
        return CollectionUpdateResponse(
            success=False, message=f"Database error: {str(e)}"
        )

    finally:
        # Always clear the lock, no matter what happens
        collection.updating = False
        db.commit()


@router.post("/{collection_id}/add-companies", response_model=CollectionUpdateResponse)
def add_companies_to_collection(
    collection_id: uuid.UUID,
    request: AddCompaniesRequest,
    db: Session = Depends(database.get_db),
):
    collection = db.query(database.CompanyCollection).get(collection_id)
    if not collection:
        return CollectionUpdateResponse(success=False, message="Collection not found")

    if collection.updating:
        return CollectionUpdateResponse(success=False, message="Collection is updating")

    # Set lock at the start
    collection.updating = True
    db.commit()

    try:
        existing_associations = (
            db.query(database.CompanyCollectionAssociation)
            .filter(
                database.CompanyCollectionAssociation.collection_id == collection_id,
                database.CompanyCollectionAssociation.company_id.in_(
                    request.company_ids
                ),
            )
            .all()
        )
        existing_company_ids = {assoc.company_id for assoc in existing_associations}

        # Only insert new companies
        new_company_ids = set(request.company_ids) - existing_company_ids

        if not new_company_ids:
            return CollectionUpdateResponse(
                success=True,
                message="All companies already in collection",
            )

        for company_id in new_company_ids:
            association = database.CompanyCollectionAssociation(
                collection_id=collection_id, company_id=company_id
            )
            db.add(association)

        db.commit()
        return CollectionUpdateResponse(
            success=True,
            message=f"Added {len(new_company_ids)} {'company' if len(new_company_ids) == 1 else 'companies'} to collection",
        )

    except Exception as e:
        db.rollback()
        return CollectionUpdateResponse(
            success=False, message=f"Database error: {str(e)}"
        )

    finally:
        # Always clear the lock, no matter what happens
        collection.updating = False
        db.commit()


# this duplicates a lot of the logic above
@router.post(
    "/{from_collection_id}/add-all-companies/{to_collection_id}/",
    response_model=CollectionUpdateResponse,
)
def add_all_companies_to_collection(
    from_collection_id: uuid.UUID,
    to_collection_id: uuid.UUID,
    db: Session = Depends(database.get_db),
):
    from_collection = db.query(database.CompanyCollection).get(from_collection_id)
    to_collection = db.query(database.CompanyCollection).get(to_collection_id)
    if not from_collection or not to_collection:
        return CollectionUpdateResponse(success=False, message="Collection not found")

    # No-op if trying to copy into the same collection
    if from_collection_id == to_collection_id:
        return CollectionUpdateResponse(
            success=False, message="Source and destination are the same"
        )

    if to_collection.updating:
        return CollectionUpdateResponse(success=False, message="Collection is updating")

    # Set lock at the start
    to_collection.updating = True
    db.commit()

    try:
        # Companies already in the destination collection
        existing_associations = (
            db.query(database.CompanyCollectionAssociation)
            .filter(
                database.CompanyCollectionAssociation.collection_id == to_collection_id,
            )
            .all()
        )
        existing_company_ids = {assoc.company_id for assoc in existing_associations}

        # Companies present in the source collection
        source_associations = (
            db.query(database.CompanyCollectionAssociation)
            .filter(
                database.CompanyCollectionAssociation.collection_id
                == from_collection_id,
            )
            .all()
        )
        source_company_ids = {assoc.company_id for assoc in source_associations}

        # Only insert companies that are in source but not already in destination
        new_company_ids = source_company_ids - existing_company_ids

        if not new_company_ids:
            return CollectionUpdateResponse(
                success=True,
                message="All companies already in collection",
            )

        for company_id in new_company_ids:
            association = database.CompanyCollectionAssociation(
                collection_id=to_collection_id, company_id=company_id
            )
            db.add(association)

        db.commit()
        return CollectionUpdateResponse(
            success=True,
            message=f"Added {len(new_company_ids)} {'company' if len(new_company_ids) == 1 else 'companies'} to collection",
        )

    except Exception as e:
        db.rollback()
        return CollectionUpdateResponse(
            success=False, message=f"Database error: {str(e)}"
        )

    finally:
        # Always clear the lock, no matter what happens
        to_collection.updating = False
        db.commit()
