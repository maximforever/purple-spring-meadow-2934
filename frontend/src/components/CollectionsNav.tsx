import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface Collection {
  id: string;
  collection_name: string;
}

interface CollectionsNavProps {
  collectionsResponse: Collection[];
  selectedCollectionId?: string;
  onCollectionSelect: (collectionId: string) => void;
}

const CollectionsNav = ({
  collectionsResponse,
  selectedCollectionId,
  onCollectionSelect,
}: CollectionsNavProps) => {
  const renderCollectionsList = () => {
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

  return (
    <>
      <p className=" font-bold border-b mb-2 pb-2 text-left">Collections</p>
      <div className="flex flex-col gap-2 text-left">{renderCollectionsList()}</div>
    </>
  );
};

export default CollectionsNav;
