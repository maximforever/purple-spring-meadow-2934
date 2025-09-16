import "./App.css";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect, useState } from "react";
import CompanyTable from "./components/CompanyTable";
import CollectionsNav from "./components/CollectionsNav";
import { getCollectionsMetadata } from "./utils/jam-api";
import useApi from "./utils/useApi";

import { ICompany } from "./types";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | undefined>();
  const [selectedCompanies, setSelectedCompanies] = useState<ICompany[]>([]);
  const { data: collectionResponse } = useApi(() => getCollectionsMetadata());

  useEffect(() => {
    setSelectedCollectionId(collectionResponse?.[0]?.id);
  }, [collectionResponse]);

  useEffect(() => {
    if (selectedCollectionId) {
      window.history.pushState({}, "", `?collection=${selectedCollectionId}`);
    }
  }, [selectedCollectionId]);

  const handleCompanySelect = (newCompanies: ICompany[]) => {
    setSelectedCompanies(newCompanies);
  };

  const moveSelectedCompaniesToCollection = (collectionId: string) => {
    console.log("moveSelectedCompaniesToCollection", collectionId);
    setSelectedCompanies([]);
    setSelectedCollectionId(collectionId);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="mx-8">
        <div className="font-bold text-xl border-b p-2 mb-4 text-left">Harmonic Jam</div>
        <div className="flex">
          <div className="w-1/5">
            <CollectionsNav
              collectionsResponse={collectionResponse || []}
              selectedCollectionId={selectedCollectionId}
              onCollectionSelect={setSelectedCollectionId}
              moveSelectedCompaniesToCollection={moveSelectedCompaniesToCollection}
              selectedCompanies={selectedCompanies}
            />
          </div>
          <div className="w-4/5 ml-4">
            {selectedCollectionId && (
              <CompanyTable
                selectedCollectionId={selectedCollectionId}
                selectedCompanies={selectedCompanies}
                handleCompanySelect={handleCompanySelect}
              />
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
