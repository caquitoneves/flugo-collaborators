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
  onLoadMore: () => void;
  loading: boolean;
  hasMore: boolean;
};

export const CollaboratorList = ({
  collaborators,
  departments,
  onAdd,
  onEditModal,
  onDelete,
  onDeleteSelected,
  onLoadMore,
  loading,
  hasMore,
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedColab, setSelectedColab] = useState<Collaborator | null>(null);

  // --- Filtragem ---
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

  const allSelected =
    filtered.length > 0 && filtered.every((c) => selectedIds.includes(c.id));

  const handleSelect = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIds(event.target.checked ? filtered.map((c) => c.id) : []);
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
        <Box display="flex" gap={2}>
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
                    {label} <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                  </TableCell>
                ))}
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}
                >
                  Status <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
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
              {filtered.map((c) => (
                <TableRow key={c.id} sx={{ background: "#fff", height: 64 }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(c.id)}
                      onChange={() => handleSelect(c.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
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
                    <IconButton color="error" onClick={() => onDelete(c.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <ViewCollaboratorModal
            open={viewModalOpen}
            onClose={() => setViewModalOpen(false)}
            collaborator={selectedColab}
            collaborators={collaborators}
            departments={departments}
          />

          {hasMore && (
            <Box display="flex" justifyContent="center" mt={3} mb={3}>
              <Button
                variant="outlined"
                onClick={onLoadMore}
                disabled={loading}
              >
                {loading ? "Carregando..." : "Carregar mais"}
              </Button>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};
