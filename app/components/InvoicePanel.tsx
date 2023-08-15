"use client";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  getGridNumericOperators,
  gridExpandedSortedRowEntriesSelector,
  useGridApiRef,
} from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import { Campaign, CampaignDetails } from "../../types";
import { calculateInvoiceTotal, calculateSubtotal } from "../utils";

import GridCellAvatar from "./cellRenderers/AvatarRenderer";
import DollarValueRenderer from "./cellRenderers/DollarValueRenderer";

interface LineItemsPanelProps {
  isLoading?: boolean;
  currency: string;
  campaign: Campaign;
  onClose: () => void;
}

function InvoicePanel({
  isLoading,
  currency,
  campaign,
  onClose,
}: LineItemsPanelProps) {
  const apiRef = useGridApiRef();
  const campaignRef = useRef(campaign);
  const [invoiceTotal, setInvoiceTotal] = useState<string | number>("0");
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails>(
    campaign.info
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 3,
      sortable: true,
      valueGetter: ({ row: { info } }) => {
        return info.details;
      },
      renderCell: ({ row: { info } }) => (
        <Typography variant="body2" fontWeight={900}>
          {info.details}
        </Typography>
      ),
    },
    {
      field: "code",
      headerName: "Code",
      sortable: true,
      valueGetter: ({ row: { info } }) => {
        return info.code;
      },
      renderCell: ({ row: { info } }) => {
        return <Chip label={info.code} size="small" />;
      },
    },
    {
      field: "bookedAmount",
      headerName: "Booked Amount",
      flex: 2,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === ">" || operator.value === "<"
      ),
      renderCell: ({ row }) => {
        return (
          <DollarValueRenderer
            currency={currency}
            applyColor={false}
            amount={row.bookedAmount}
          />
        );
      },
    },
    {
      field: "actualAmount",
      headerName: "Actual Amount",
      flex: 2,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === ">" || operator.value === "<"
      ),
      renderCell: ({ row }) => {
        return (
          <DollarValueRenderer
            currency={currency}
            applyColor={false}
            amount={row.actualAmount}
          />
        );
      },
    },
    {
      field: "adjustments",
      headerName: "Adjustments",
      editable: true,
      flex: 2,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === ">" || operator.value === "<"
      ),
      renderCell: ({ row }) => {
        return (
          <DollarValueRenderer
            currency={currency}
            applyColor={true}
            amount={row.adjustments}
          />
        );
      },
    },
    {
      field: "subtotal",
      headerName: "Subtotal",
      flex: 2,
      sortable: true,
      filterOperators: getGridNumericOperators().filter(
        (operator) => operator.value === ">" || operator.value === "<"
      ),
      valueGetter: (params) => {
        return calculateSubtotal(params);
      },
      renderCell: (params) => {
        return (
          <DollarValueRenderer
            currency={currency}
            applyColor={true}
            amount={calculateSubtotal(params)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    campaignRef.current = campaign;
    setCampaignDetails(campaign.info);
  }, [campaign]);

  useEffect(() => {
    return apiRef.current.subscribeEvent("stateChange", () => {
      // @afuller: Adaptation of a known suboptimal approach,
      // see: https://github.com/mui/mui-x/issues/2438
      const filterItems: any[] = gridExpandedSortedRowEntriesSelector(apiRef);

      setInvoiceTotal(
        calculateInvoiceTotal(filterItems.map((item: any) => item.model))
      );
    });
  }, [apiRef, invoiceTotal, currency]);

  return (
    <Paper>
      <Box padding={2}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid xs={8}>
            <Typography variant="h4">Invoice</Typography>
            <Stack direction="row" spacing={2} padding={2}>
              <GridCellAvatar details={campaign.info} />

              <Stack direction="column">
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="normal"
                  spacing={0.5}
                >
                  <Grid>
                    <Typography variant="h5">
                      {campaignDetails.company}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Chip label={campaignDetails.code} size="small" />
                  </Grid>
                </Grid>
                <Typography variant="body2">
                  {campaignDetails.details}
                </Typography>
                <Stack direction="row">
                  <Typography
                    variant="body2"
                    fontWeight={300}
                  >{`Campaign ID#: ${campaign.id}`}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
          <Grid xs={3}>
            <Stack padding={3} alignItems="center">
              <Avatar>
                <ReceiptIcon fontSize="medium" />
              </Avatar>

              <Typography variant="caption" fontWeight={300}>
                Invoice Total:
              </Typography>
              <DollarValueRenderer
                currency={currency}
                applyColor={true}
                amount={invoiceTotal}
              />
            </Stack>
          </Grid>
          <Grid
            xs={1}
            sx={{ position: "absolute", right: 0, marginBottom: 15 }}
          >
            <IconButton
              data-testid="close-button"
              aria-label="close"
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Box>

      <Stack direction="column" padding={2}>
        <Box style={{ height: 400, width: "100%" }}>
          <DataGrid
            loading={isLoading}
            apiRef={apiRef}
            rows={campaignRef.current.lineItems}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            disableRowSelectionOnClick
          />
        </Box>
      </Stack>
    </Paper>
  );
}

export default InvoicePanel;
