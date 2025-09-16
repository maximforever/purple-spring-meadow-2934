import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getCollectionsById } from "../utils/jam-api";
import { ICompany } from "../types";

type CompanyTableProps = {
  selectedCollectionId: string;
  selectedCompanies: ICompany[];
  handleCompanySelect: (companies: ICompany[]) => void;
};

const CompanyTable = ({
  selectedCollectionId,
  handleCompanySelect,
  selectedCompanies,
}: CompanyTableProps) => {
  const [response, setResponse] = useState<ICompany[]>([]);
  const [total, setTotal] = useState<number>();
  const [offset, setOffset] = useState<number>(0);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    getCollectionsById(selectedCollectionId, offset, pageSize).then((newResponse) => {
      setResponse(newResponse.companies);
      setTotal(newResponse.total);
    });
  }, [selectedCollectionId, offset, pageSize]);

  useEffect(() => {
    setOffset(0);
  }, [selectedCollectionId]);

  const updateSelectedCompanies = (newRowSelectionModel: number[]) => {
    const newCompanySelection: ICompany[] = [];

    for (const id of newRowSelectionModel) {
      const company = response.find((company) => company.id === id);
      if (company) {
        newCompanySelection.push(company);
      }
    }

    handleCompanySelect(newCompanySelection);
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
        rowSelectionModel={selectedCompanies.map((company) => company.id)}
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
