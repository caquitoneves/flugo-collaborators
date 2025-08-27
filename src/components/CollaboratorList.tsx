import { useState, useMemo } from "react";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Avatar,
  Button,
  Paper,
  Typography,
  IconButton,
  Checkbox,
  TextField,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Visibility } from "@mui/icons-material";
import { Collaborator, Department } from "../types";
import { ViewCollaboratorModal } from "./ViewCollaboratorModal";

type Props = {
  collaborators: Collaborator[];
  departments: Department[];
  onAdd: () => void;
  onEditModal: (collaborator: Collaborator) => void;
  onDelete: (id: string) => void;
  onDeleteSelected: (ids: string[]) => void;
  loading: boolean;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
};

export const CollaboratorList = ({
  collaborators,
  departments,
  onAdd,
  onEditModal,
  onDelete,
  onDeleteSelected,
  loading,
  selectedIds,
  setSelectedIds,
}: Props) => {
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedColab, setSelectedColab] = useState<Collaborator | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const rowsPerPage = 5;

  const filtered = useMemo(() => {
    const nameF = filterName.toLowerCase();
    const emailF = filterEmail.toLowerCase();
    const deptF = filterDepartment.toLowerCase();

    return collaborators.filter((c) => {
      return (
        c.name.toLowerCase().includes(nameF) &&
        c.email.toLowerCase().includes(emailF) &&
        (c.departmentName ?? "").toLowerCase().includes(deptF)
      );
    });
  }, [collaborators, filterName, filterEmail, filterDepartment]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const indexOfLast = (currentPage + 1) * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filtered.slice(indexOfFirst, indexOfLast);

  const allSelected =
    currentRows.length > 0 &&
    currentRows.every((c) => selectedIds.includes(c.id));

  const handleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds((prev) =>
      event.target.checked
        ? Array.from(new Set([...prev, ...currentRows.map((c) => c.id)]))
        : prev.filter((id) => !currentRows.some((c) => c.id === id))
    );
  };

  const handleLoadMore = (direction: "next" | "prev") => {
    if (direction === "next" && currentPage + 1 < totalPages) {
      setCurrentPage((p) => p + 1);
    }
    if (direction === "prev" && currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 2, mt: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        px={4}
      >
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#222" }}>
          Colaboradores
        </Typography>
        <Box display="flex" gap={2} alignItems="center">
          {selectedIds.length > 0 && (
            <Typography variant="body2" sx={{ color: "#6B7280", mr: 1 }}>
              {selectedIds.length} selecionado(s)
            </Typography>
          )}
          <Button
            variant="contained"
            sx={{
              bgcolor: "#22C55E",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 0.5,
              boxShadow: "none",
              textTransform: "none",
              px: 1.5,
              py: 1.2,
              fontSize: 16,
              "&:hover": { bgcolor: "#16A34A" },
            }}
            onClick={onAdd}
          >
            Novo Colaborador
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={selectedIds.length === 0}
            onClick={() => onDeleteSelected(selectedIds)}
            sx={{
              fontWeight: 600,
              borderRadius: 0.5,
              boxShadow: "none",
              textTransform: "none",
              px: 1.5,
              py: 1.2,
              fontSize: 16,
            }}
          >
            Excluir Selecionados
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Box display="flex" gap={2} mb={2} px={4}>
        <TextField
          label="Nome"
          variant="outlined"
          size="small"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          size="small"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
        />
        <TextField
          label="Departamento"
          variant="outlined"
          size="small"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        />
      </Box>

      {/* Tabela */}
      <Box sx={{ px: 4 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2.5,
            boxShadow: "0px 2px 15px 0px #0000000D",
            overflow: "hidden",
          }}
        >
          <Table sx={{ minWidth: 650, bgcolor: "#F9FAFB" }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F9FAFB", height: 56 }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allSelected}
                    onChange={handleSelectAll}
                    color="primary"
                  />
                </TableCell>
                {["Nome", "Email", "Departamento"].map((label) => (
                  <TableCell
                    key={label}
                    sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}
                  >
                    {label}{" "}
                    <ArrowDownwardIcon
                      sx={{ fontSize: 16, ml: 0.5, verticalAlign: "middle" }}
                    />
                  </TableCell>
                ))}
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}
                >
                  Status{" "}
                  <ArrowDownwardIcon
                    sx={{ fontSize: 16, ml: 0.5, verticalAlign: "middle" }}
                  />
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}
                >
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {currentRows.map((c) => (
                <TableRow key={c.id} sx={{ background: "#fff", height: 64 }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(c.id)}
                      onChange={() => handleSelect(c.id)}
                      color="primary"
                    />
                  </TableCell>

                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar src={c.avatarUrl} alt={c.name} />
                      <Typography sx={{ fontWeight: 500, color: "#222" }}>
                        {c.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.departmentName ?? ""}</TableCell>

                  <TableCell align="right">
                    <Chip
                      label={c.status === "ativo" ? "Ativo" : "Inativo"}
                      sx={{
                        bgcolor: c.status === "ativo" ? "#DEF7EC" : "#FEE2E2",
                        color: c.status === "ativo" ? "#22C55E" : "#EF4444",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => onEditModal(c)}
                      title="Editar"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="info"
                      onClick={() => {
                        setSelectedColab(c);
                        setViewModalOpen(true);
                      }}
                      title="Visualizar"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => onDelete(c.id)}
                      title="Excluir"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {currentRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhum colaborador encontrado nesta página com os filtros
                      atuais.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Modal de Visualização */}
          <ViewCollaboratorModal
            open={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            collaborator={selectedColab}
            collaborators={collaborators}
            departments={departments}
          />

          {/* Paginação */}
          {/* Paginação */}
          <Box
            display="flex"
            justifyContent="space-between"
            mt={3}
            mb={3}
            px={2}
          >
            <Button
              variant="outlined"
              onClick={() => handleLoadMore("prev")}
              disabled={loading || currentPage === 0}
            >
              Anterior
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleLoadMore("next")}
              disabled={loading || currentPage + 1 >= totalPages}
            >
              Próxima
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
