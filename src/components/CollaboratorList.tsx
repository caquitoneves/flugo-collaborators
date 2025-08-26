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
import { useState, useMemo } from "react";
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

  // Filtragem
  const filteredCollaborators = useMemo(() => {
    const depFilter = filterDepartment.toLowerCase();
    const nameFilter = filterName.toLowerCase();
    const emailFilter = filterEmail.toLowerCase();

    return collaborators.filter((colab) => {
      const nameMatch = colab.name.toLowerCase().includes(nameFilter);
      const emailMatch = colab.email.toLowerCase().includes(emailFilter);
      const deptValue = (colab.departmentName ?? "").toLowerCase();
      const deptMatch = deptValue.includes(depFilter);
      return nameMatch && emailMatch && deptMatch;
    });
  }, [collaborators, filterName, filterEmail, filterDepartment]);

  // Seleção
  const allSelected =
    filteredCollaborators.length > 0 &&
    filteredCollaborators.every((c) => selectedIds.includes(c.id));

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(filteredCollaborators.map((c) => c.id));
    } else {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredCollaborators.some((c) => c.id === id))
      );
    }
  };

  return (
    <Box sx={{ width: "100%", p: 2, mt: 3 }}>
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
          label="Filtrar por nome"
          variant="outlined"
          size="small"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <TextField
          label="Filtrar por email"
          variant="outlined"
          size="small"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
        />
        <TextField
          label="Filtrar por departamento"
          variant="outlined"
          size="small"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        />
      </Box>

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
                <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                  Nome <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                  Email <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                  Departamento <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                  Status <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                  Ações
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCollaborators.map((colab) => (
                <TableRow key={colab.id} sx={{ background: "#fff", height: 64 }}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.includes(colab.id)}
                      onChange={() => handleSelect(colab.id)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={colab.avatarUrl} alt={colab.name} />
                      <Typography sx={{ fontWeight: 500, color: "#222" }}>
                        {colab.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{colab.email}</TableCell>
                  <TableCell>{colab.departmentName ?? ""}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={colab.status === "ativo" ? "Ativo" : "Inativo"}
                      sx={{
                        bgcolor: colab.status === "ativo" ? "#DEF7EC" : "#FEE2E2",
                        color: colab.status === "ativo" ? "#22C55E" : "#EF4444",
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => onEditModal(colab)}
                      title="Editar colaborador"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="info"
                      onClick={() => {
                        setSelectedColab(colab);
                        setViewModalOpen(true);
                      }}
                      title="Visualizar colaborador"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(colab.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <ViewCollaboratorModal
              open={viewModalOpen}
              onClose={() => setViewModalOpen(false)}
              collaborator={selectedColab}
              collaborators={collaborators}
              departments={departments} // 👈 agora passando a lista real
            />
          </Table>
        </Paper>

        {hasMore && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Button variant="outlined" onClick={onLoadMore} disabled={loading}>
              {loading ? "Carregando..." : "Carregar mais"}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
