import { useState } from "react";
import { ICollection, ICompany } from "../types";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type ListControlsProps = {
  collections: ICollection[];
  selectedCollectionId?: string;
  selectedCompanies: ICompany[];
  moveSelectedCompaniesToCollection: (collectionId: string) => void;
};

export default function ListControls({
  collections,
  selectedCollectionId,
  selectedCompanies,
  moveSelectedCompaniesToCollection,
}: ListControlsProps) {
  const otherCollections = collections.filter(
    (collection) => collection.id !== selectedCollectionId,
  );

  const [listToMoveTo, setListToMoveTo] = useState<ICollection | undefined>();

  if (!selectedCompanies.length) {
    return null;
  }

  const renderOtherCollectionsList = () => {
    return otherCollections.map((collection) => {
      const classes = twMerge(
        clsx(
          "py-1 pl-2 text-sm xl:text-base hover:cursor-pointer hover:bg-orange-300 w-full text-left select-none",
          listToMoveTo?.id === collection.id && "bg-orange-500 font-bold",
        ),
      );

      return (
        <div
          key={collection.id}
          className={classes}
          onClick={() => handleSelectListToMoveTo(collection)}
        >
          {collection.collection_name}
        </div>
      );
    });
  };

  const handleSelectListToMoveTo = (newList: ICollection) => {
    if (listToMoveTo?.id === newList.id) {
      setListToMoveTo(undefined);
      return;
    }

    setListToMoveTo(newList);
  };

  const handleListMove = () => {
    if (listToMoveTo === undefined) {
      return;
    }

    //setMoving(true); // TODO - move this to context
    setListToMoveTo(undefined);
    moveSelectedCompaniesToCollection(listToMoveTo.id);
  };

  const label = selectedCompanies.length === 1 ? "company" : "companies";

  return (
    <div className="my-8 py-4 flex flex-col items-start w-full">
      <span className="text-xs text-gray-300 font-bold pb-2">
        Add {selectedCompanies.length} {label} to list:
      </span>
      <div className="flex flex-col gap-2 items-start w-full">{renderOtherCollectionsList()}</div>
      {listToMoveTo !== undefined && (
        <button
          className="bg-orange-500 text-white px-4 py-0 text-sm my-2 w-full rounded-md"
          onClick={() => handleListMove()}
        >
          Add to list
        </button>
      )}
    </div>
  );
}
