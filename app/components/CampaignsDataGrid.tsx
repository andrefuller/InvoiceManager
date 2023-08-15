"use client";
import {
  DataGrid,
  GridColDef,
  GridRowParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  getGridNumericOperators,
} from "@mui/x-data-grid";
import { useState } from "react";

import { Box, Chip, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { Campaign } from "../../types";
import { calculateInvoiceTotal } from "../utils";
import LineItemsPanel from "./InvoicePanel";
import DollarValueRenderer from "./cellRenderers/DollarValueRenderer";

interface CampaignsDataGridProps {
  isLoading?: boolean;
  currency: string;
  campaigns: Campaign[];
}

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  );
};

const CampaignsDataGrid: React.FC<CampaignsDataGridProps> = ({
  isLoading,
  currency,
  campaigns,
}) => {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
    },
    {
      field: "name",
      headerName: "Company",
      flex: 3,
      sortable: true,
      valueGetter: ({ row }) => {
        return row.info.company;
      },
      renderCell: ({ row: { info } }) => {
        return (
          <Typography variant="body2" fontWeight={900}>
            {info.company}
          </Typography>
        );
      },
    },
    {
      field: "details",
      headerName: "Campaign Details",
      flex: 3,
      sortable: true,
      valueGetter: ({ row }) => {
        return row.info.details;
      },
      renderCell: ({ row: { info } }) => (
        <Typography variant="body2" paddingRight={0.5}>
          {info.details}
        </Typography>
      ),
    },
    {
      field: "code",
      headerName: "Code",
      sortable: true,
      valueGetter: ({ row }) => {
        return row.info.code;
      },
      renderCell: ({ row: { info } }) => {
        return <Chip label={info.code} size="small" />;
      },
    },
    {
      field: "totals",
      headerName: "Invoice Total",
      flex: 3,
      sortable: true,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === ">" || operator.value === "<"
      ),
      valueGetter: ({ row }) => {
        return calculateInvoiceTotal(row.lineItems);
      },
      renderCell: ({ row }) => {
        return (
          <DollarValueRenderer
            currency={currency}
            applyColor={false}
            amount={calculateInvoiceTotal(row.lineItems)}
          />
        );
      },
    },
  ];

  const handleRowClick = (params: GridRowParams) => {
    setSelectedCampaign(params.row as Campaign);
  };

  const handleSidePanelClose = () => {
    setSelectedCampaign(null);
  };

  return (
    <Box paddingTop={3}>
      <Stack spacing={3}>
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid height={400} width="100%">
            <DataGrid
              loading={isLoading}
              rows={campaigns}
              columns={columns}
              slots={{ toolbar: CustomToolbar }}
              hideFooterSelectedRowCount
              onRowClick={handleRowClick}
            />
          </Grid>

          {selectedCampaign && (
            <Grid width="100%">
              <LineItemsPanel
                isLoading={isLoading}
                currency={currency}
                campaign={selectedCampaign}
                onClose={handleSidePanelClose}
              />
            </Grid>
          )}
        </Grid>
      </Stack>
    </Box>
  );
};

export default CampaignsDataGrid;
