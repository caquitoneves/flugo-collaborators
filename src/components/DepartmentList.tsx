import { useState, useEffect, useMemo } from "react";
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
  TextField,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Department, Collaborator } from "../types";

type Props = {
  collaborators: Collaborator[];
  departments: Department[];
  onEdit: (dept: Department) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  fetchMoreDepartments: (page: number, pageSize: number) => Promise<Department[]>;
};

const PAGE_SIZE = 5;

export const DepartmentList = ({
  collaborators,
  departments,
  onEdit,
  onDelete,
  onAdd,
  fetchMoreDepartments,
}: Props) => {
  const [filterName, setFilterName] = useState("");
  const [paginatedDepartments, setPaginatedDepartments] = useState<Department[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filtra departamentos
  const filteredDepartments = useMemo(() => {
    return paginatedDepartments.filter((d) =>
      d.name.toLowerCase().includes(filterName.toLowerCase())
    );
  }, [paginatedDepartments, filterName]);

  const loadPage = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchMoreDepartments(page, PAGE_SIZE);
      setPaginatedDepartments(data);
      setCurrentPage(page);
      setHasNext(data.length === PAGE_SIZE);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Inicializa a primeira página
  useEffect(() => {
    loadPage(1);
  }, [departments]);

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
          Departamentos
        </Typography>
        <Button
          variant="contained"
          onClick={onAdd}
          sx={{
            bgcolor: "#22C55E",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 0.5,
            boxShadow: "none",
            textTransform: "none",
            px: 2,
            py: 1.2,
            fontSize: 16,
            "&:hover": { bgcolor: "#16A34A" },
          }}
        >
          Novo Departamento
        </Button>
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
                <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                  Nome <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                  Gestor <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                  Colaboradores <ArrowDownwardIcon sx={{ fontSize: 16, ml: 0.5 }} />
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
              {filteredDepartments.map((dept) => (
                <TableRow key={dept.id} sx={{ background: "#fff", height: 64 }}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500, color: "#222" }}>
                      {dept.name}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {collaborators.find((c) => c.id === dept.manager) ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          src={collaborators.find((c) => c.id === dept.manager)?.avatarUrl}
                          sx={{ width: 32, height: 32 }}
                        />
                        <Typography sx={{ fontWeight: 500 }}>
                          {collaborators.find((c) => c.id === dept.manager)?.name}
                        </Typography>
                      </Box>
                    ) : (
                      <Chip label="Não definido" color="warning" />
                    )}
                  </TableCell>

                  <TableCell>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {collaborators
                        .filter((c) => c.departmentId === dept.id)
                        .map((colab) => (
                          <Chip
                            key={colab.id}
                            avatar={<Avatar src={colab.avatarUrl} sx={{ width: 24, height: 24 }} />}
                            label={colab.name}
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                    </Box>
                  </TableCell>

                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => onEdit(dept)} title="Editar">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(dept.id)} title="Excluir">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
          <Box display="flex" justifyContent="space-between" mt={3} mb={3} px={2}>
            <Button
              variant="outlined"
              onClick={() => loadPage(currentPage - 1)}
              disabled={currentPage === 1 || loading}
            >
              Anterior
            </Button>
            <Button
              variant="outlined"
              onClick={() => loadPage(currentPage + 1)}
              disabled={!hasNext || loading}
            >
              Próximo
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
