import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import ListControls from "./ListControls";

import { ICollection, ICompany } from "../types";

interface CollectionsNavProps {
  collectionsResponse?: ICollection[];
  selectedCollectionId?: string;
  onCollectionSelect: (collectionId: string) => void;
  moveSelectedCompaniesToCollection: (collectionId: string) => void;
  selectedCompanies: ICompany[];
}

const CollectionsNav = ({
  collectionsResponse,
  selectedCollectionId,
  onCollectionSelect,
  moveSelectedCompaniesToCollection,
  selectedCompanies,
}: CollectionsNavProps) => {
  const renderCollectionsList = () => {
    if (!collectionsResponse) {
      return null;
    }

    return collectionsResponse.map((collection) => {
      const classes = twMerge(
        clsx(
          "py-1 pl-2 text-sm xl:text-base hover:cursor-pointer hover:bg-orange-300",
          selectedCollectionId === collection.id && "bg-orange-500 font-bold",
        ),
      );

      return (
        <div
          key={collection.id}
          className={classes}
          onClick={() => {
            onCollectionSelect(collection.id);
          }}
        >
          {collection.collection_name}
        </div>
      );
    });
  };

  // TODO - add skeleton/loading state
  if (!collectionsResponse) {
    return null;
  }

  return (
    <>
      <p className=" font-bold border-b mb-2 pb-2 text-left">Collections</p>
      <div className="flex flex-col gap-2 text-left">{renderCollectionsList()}</div>
      <ListControls
        collections={collectionsResponse}
        selectedCollectionId={selectedCollectionId}
        moveSelectedCompaniesToCollection={moveSelectedCompaniesToCollection}
        selectedCompanies={selectedCompanies}
      />
    </>
  );
};

export default CollectionsNav;
