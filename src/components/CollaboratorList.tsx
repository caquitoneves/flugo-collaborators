import {
  Box, Table, TableHead, TableRow, TableCell, TableBody, Chip, Avatar, Button, Paper, Typography
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Collaborator } from "../types";

type Props = {
  collaborators: Collaborator[];
  onAdd: () => void;
  onLoadMore: () => void;
  loading: boolean;
  hasMore: boolean;
};

export const CollaboratorList = ({ collaborators, onAdd, onLoadMore, loading, hasMore }: Props) => {
  return (
    <Box sx={{ width: "100%", p: 2, mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} px={4}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#222" }}>
          Colaboradores
        </Typography>
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
                <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                  Nome <ArrowDownwardIcon sx={{ fontSize: 16, verticalAlign: "middle", ml: 0.5, color: "#6b7a8a" }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                  Email <ArrowDownwardIcon sx={{ fontSize: 16, verticalAlign: "middle", ml: 0.5, color: "#6b7a8a" }} />
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: "#768591", fontSize: 14 }}>
                  Departamento <ArrowDownwardIcon sx={{ fontSize: 16, verticalAlign: "middle", ml: 0.5, color: "#6b7a8a" }} />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "#768591", fontSize: 14, pr: 2 }}>
                  Status <ArrowDownwardIcon sx={{ fontSize: 14, verticalAlign: "middle", ml: 0.5, color: "#6b7a8a" }} />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collaborators.map((colab) => (
                <TableRow
                  key={colab.id}
                  sx={{
                    background: "#fff",
                    height: 64,
                    "&:not(:last-child)": { borderBottom: "1px solid #ECECEC" },
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar
                        src={colab.avatarUrl}
                        alt={colab.name}
                        sx={{ width: 40, height: 40, mr: 1, boxShadow: "0px 2px 10px 0px #0000000D" }}
                      />
                      <Typography sx={{ fontWeight: 500, color: "#222" }}>{colab.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "#525252", fontSize: 15 }}>{colab.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: "#525252", fontSize: 15 }}>{colab.department}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 0 }}>
                    <Chip
                      label={colab.status === "ativo" ? "Ativo" : "Inativo"}
                      sx={{
                        bgcolor: colab.status === "ativo" ? "#DEF7EC" : "#FEE2E2",
                        color: colab.status === "ativo" ? "#22C55E" : "#EF4444",
                        fontWeight: 600,
                        fontSize: 12,
                        borderRadius: 0.5,
                        mr: 2,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
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
