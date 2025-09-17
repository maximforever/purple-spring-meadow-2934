import { useState, useEffect } from "react";
import { ICollection, ICompany } from "../types";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

type ListControlsProps = {
  collections: ICollection[];
  selectedCollectionId?: string;
  selectedCompanies: ICompany[];
  moveSelectedCompaniesToCollection: (collectionId: string | "all") => void;
  moveAllCompaniesToCollection: ({
    fromCollectionId,
    toCollectionId,
  }: {
    fromCollectionId: string;
    toCollectionId: string;
  }) => void;
  movingCompanies: boolean;
  movingCompaniesError: string | null;
};

export default function ListControls({
  collections,
  selectedCollectionId,
  selectedCompanies,
  moveSelectedCompaniesToCollection,
  moveAllCompaniesToCollection,
  movingCompanies,
  movingCompaniesError,
}: ListControlsProps) {
  const otherCollections = collections.filter(
    (collection) => collection.id !== selectedCollectionId,
  );

  const [listToMoveTo, setListToMoveTo] = useState<ICollection | undefined>();
  const [step, setStep] = useState<"select" | "showList">("select");
  const [selection, setSelection] = useState<"selected" | "all">("selected");

  useEffect(() => {
    setStep("select");
    setSelection;
  }, [selectedCompanies]);

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
    if (selection === "selected") {
      moveSelectedCompaniesToCollection(listToMoveTo.id);
    } else {
      if (selectedCollectionId === undefined) {
        // TODO - error handling
        return;
      }

      moveAllCompaniesToCollection({
        fromCollectionId: selectedCollectionId,
        toCollectionId: listToMoveTo.id,
      });
    }
  };

  const label = selectedCompanies.length === 1 ? "company" : "companies";

  const renderSelectStep = () => {
    return (
      <div className="flex flex-col gap-2 items-start w-full">
        <span
          className="text-xs xl:text-sm text-gray-300 font-bold text-left hover:text-orange-500 hover:cursor-pointer"
          onClick={() => {
            setSelection("selected");
            setStep("showList");
          }}
        >
          Add {selectedCompanies.length} {label} to a new list
        </span>
        <span
          className="text-xs xl:text-sm text-gray-300 font-bold text-left hover:text-orange-500 hover:cursor-pointer"
          onClick={() => {
            setSelection("all");
            setStep("showList");
          }}
        >
          Add <span className="underline">all companies</span> to new list
        </span>
      </div>
    );
  };

  const renderShowListStep = () => {
    const companyCount = selection === "selected" ? selectedCompanies.length : "all";
    const label =
      selection === "selected" && selectedCompanies.length === 1 ? "company" : "companies";

    return (
      <div className="flex flex-col gap-2 items-start w-full">
        <span className="text-xs xl:text-sm text-gray-300 font-bold text-left pb-4">
          Add{" "}
          <span className="underline">
            {companyCount} {label}
          </span>{" "}
          to list
        </span>
        <div className="flex flex-col gap-2 items-start w-full">{renderOtherCollectionsList()}</div>
        <div className="w-full mt-8">
          <button
            className="bg-inherit text-white px-4 py-0 text-sm my-2 w-full rounded-md hover:text-orange-500 hover:cursor-pointer hover:border-black"
            onClick={() => {
              setStep("select");
            }}
          >
            Cancel
          </button>
          {listToMoveTo !== undefined && (
            <button
              className="bg-orange-500 text-white px-4 py-0 text-sm my-2 w-full rounded-md"
              onClick={() => handleListMove()}
            >
              Add to list
            </button>
          )}
        </div>
      </div>
    );
  };

  if (movingCompanies) {
    return (
      <div className="my-8 py-4 flex flex-col items-start w-full">
        <p className="text-sm text-gray-300 font-bold text-left">Moving companies...</p>
      </div>
    );
  }

  if (movingCompaniesError) {
    return (
      <div className="my-8 py-4 flex flex-col items-start w-full">
        <p className="text-sm text-red-700 font-bold text-left">{movingCompaniesError}</p>
        <button
          className="bg-inherit text-white px-4 py-0 text-sm my-2 w-full rounded-md hover:text-orange-500 hover:cursor-pointer hover:border-black"
          onClick={() => {
            setStep("select");
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (!selectedCompanies.length) {
    return null;
  }

  return (
    <div className="my-8 py-4 flex flex-col items-start w-full">
      {step === "showList" ? renderShowListStep() : renderSelectStep()}
    </div>
  );
}
