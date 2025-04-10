import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { PaperBase } from "../../components/surfaces/PaperBase.tsx";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { PartnerListLabels } from "../../shared/labels/PartnerList.labels.ts";
import { PartnerData } from "../../store/interfaces/PartnerState.interfaces.ts";
import { usePartnerListState } from "./state/usePartnerListState.tsx";
import { PartnerModal } from "../../components/modals/Partner/PartnerModal.tsx";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { PartnerSavingListModal } from "../../components/modals/PartnerSavingList/PartnerSavingListModal.tsx";
import {
  geSavingStatusIcon,
  getLoanAccountStatusIcon,
} from "../../shared/utils/Components.util.tsx";
import { PartnerLoanListModal } from "../../components/modals/PartnerLoanList/PartnerLoanListModal.tsx";

export const PartnerList = () => {
  const { partners, pagination, isLoading, modal, alert } =
    usePartnerListState();

  return (
    <PaperBase>
      <Box p={2}>
        <Typography textAlign={"center"} variant={"h6"}>
          {PartnerListLabels.TITLE}
        </Typography>
      </Box>
      <TableContainer>
        <PartnerModal
          partnerData={modal.rowSelected}
          open={modal.isModalOpen}
          handleClose={modal.onCloseModal}
        />
        <PartnerSavingListModal
          partnerData={modal.rowSelected}
          open={modal.isSavingModalOpen}
          handleClose={modal.onCloseSavingModal}
        />
        <PartnerLoanListModal
          partnerData={modal.rowSelected}
          open={modal.isLoanModalOpen}
          handleClose={modal.onCloseLoanModal}
        />
        <Dialog open={alert.isAlertOpen} onClose={alert.onCloseAlert}>
          <DialogTitle>{"Eliminar Socio"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Esta seguro de eliminar la cuenta Nº${alert.rowToDelete?.number} del socio ${alert.rowToDelete?.names} ${alert.rowToDelete?.surnames}. Documento: ${alert.rowToDelete?.dni}.`}
            </DialogContentText>
            <DialogContentText>
              {
                "Al eliminar, se bloquearán todos los movimientos y se dará como finalizada la cuenta."
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={alert.onCloseAlert}
              size={"small"}
              variant={"outlined"}
              color={"inherit"}
            >
              Cancelar
            </Button>
            <Button
              onClick={alert.onAcceptDelete}
              size={"small"}
              variant={"contained"}
              color={"error"}
              endIcon={<DeleteOutlineIcon />}
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
        <Box display={"flex"} justifyContent={"end"}>
          <Button
            variant={"contained"}
            endIcon={<AddCircleIcon />}
            onClick={() => modal.onOpenModal()}
          >
            {PartnerListLabels.ADD_PARTNER}
          </Button>
        </Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography color={"red"}>
                  {PartnerListLabels.TH_ACCOUNT}
                </Typography>
              </TableCell>
              <TableCell align="left">{PartnerListLabels.TH_NAMES}</TableCell>
              <TableCell align="left">
                {PartnerListLabels.TH_DOCUMENT}
              </TableCell>
              <TableCell align="center">
                {PartnerListLabels.TH_SAVING}
              </TableCell>
              <TableCell align="center">{PartnerListLabels.TH_LOAN}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array(pagination.rowsPerPage)
                  .fill(0)
                  .map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {Array(5)
                        .fill(0)
                        .map((_, colIndex) => (
                          <TableCell key={colIndex}>
                            <Skeleton animation="wave" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              : partners.map((row: PartnerData) => (
                  <TableRow key={row.number}>
                    <TableCell align={"center"}>
                      <b>{row.number}</b>
                    </TableCell>
                    <TableCell>
                      <i>{`${row.names} ${row.surnames}`}</i>
                    </TableCell>
                    <TableCell>{row.dni}</TableCell>
                    <TableCell align={"center"}>
                      <Button
                        size={"small"}
                        variant="outlined"
                        startIcon={geSavingStatusIcon(
                          row.savingStatus,
                          row.is_disabled
                        )}
                        onClick={() => modal.onOpenSavingModal(row)}
                      >
                        {`$${row.current_saving}`}
                      </Button>
                    </TableCell>
                    <TableCell align={"center"}>
                      <Button
                        size={"small"}
                        variant="outlined"
                        startIcon={getLoanAccountStatusIcon(row.loanStatus)}
                        onClick={() => modal.onOpenLoanModal(row)}
                      >
                        {`${row.loanCount}`}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar Información">
                        <IconButton
                          color="primary"
                          onClick={() => modal.onOpenModal(row)}
                        >
                          <OpenInNewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Desactivar Socio">
                        <IconButton
                          color="error"
                          onClick={() => alert.onOpenAlert(row)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 30, 50]}
                count={pagination.partnersCount - 1}
                rowsPerPage={pagination.rowsPerPage}
                page={pagination.page}
                onPageChange={pagination.onPageChange}
                onRowsPerPageChange={pagination.onRowsPerPageChange}
              />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </PaperBase>
  );
};
