import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getCollectionsById } from "../utils/jam-api";
import { ICompany } from "../types";

const CompanyTable = (props: { selectedCollectionId: string }) => {
  const [response, setResponse] = useState<ICompany[]>([]);
  const [total, setTotal] = useState<number>();
  const [offset, setOffset] = useState<number>(0);
  const [pageSize, setPageSize] = useState(25);

  const [selectedCompanies, setSelectedCompanies] = useState<ICompany[]>([]);

  useEffect(() => {
    getCollectionsById(props.selectedCollectionId, offset, pageSize).then((newResponse) => {
      setResponse(newResponse.companies);
      setTotal(newResponse.total);
    });
  }, [props.selectedCollectionId, offset, pageSize]);

  useEffect(() => {
    setOffset(0);
  }, [props.selectedCollectionId]);

  const updateSelectedCompanies = (newRowSelectionModel: number[]) => {
    const newCompanySelection: ICompany[] = [];

    for (const id of newRowSelectionModel) {
      const company = response.find((company) => company.id === id);
      if (company) {
        newCompanySelection.push(company);
      }
    }

    setSelectedCompanies(newCompanySelection);
  };

  const renderListControls = () => {
    if (selectedCompanies.length === 0) {
      return null;
    }

    return (
      <div>
        <div>
          {selectedCompanies
            .sort((a, b) => (b.id - a.id > 0 ? -1 : 1))
            .map((company) => company.company_name)
            .join(", ")}
        </div>
        <div className="my-2">
          Add to list:
          <select className="text-white bg-black border border-white">
            <option value="liked">Liked</option>
            <option value="my_list">My List</option>
            <option value="companies_to_ignore">Companies to Ignore</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={response}
        rowHeight={30}
        columns={[
          { field: "liked", headerName: "Liked", width: 90 },
          { field: "id", headerName: "ID", width: 90 },
          { field: "company_name", headerName: "Company Name", width: 200 },
        ]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 25 },
          },
        }}
        rowCount={total}
        pagination
        checkboxSelection
        onRowSelectionModelChange={(newRowSelectionModel) => {
          updateSelectedCompanies(newRowSelectionModel as number[]);
        }}
        paginationMode="server"
        onPaginationModelChange={(newMeta) => {
          setPageSize(newMeta.pageSize);
          setOffset(newMeta.page * newMeta.pageSize);
        }}
      />
    </div>
  );
};

export default CompanyTable;
