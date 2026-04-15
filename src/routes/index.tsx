import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import VerificarToken from "../pages/VerificarToken/VerificarToken";
import EsqueceuSenha from "../pages/EsqueceuSenha/EsqueceuSenha";
import RedefinirSenha from "../pages/RedefinirSenha/RedefinirSenha";
import Dashboard from "../pages/Dashboard/Dashboard";
import ListagemQuestoes from "../pages/Questoes/ListagemQuestoes";
import ListagemQuestoesPrivadas from "../pages/Questoes/ListagemQuestoesPrivadas";
import DetalheQuestao from "../pages/Questoes/DetalheQuestao";
import CriarQuestao from "../pages/Questoes/CriarQuestao";
import EditarQuestao from "../pages/Questoes/EditarQuestao";
import Perfil from "../pages/Perfil/Perfil";
import TurmasPage from "../pages/Turmas/Turmas";


import LayoutProtegido from "../shared/components/LayoutProtegido";
import PaginaAvaliacoes from "../pages/Avaliacoes/Avaliacoes";
import CriarAvaliacao from "../pages/Avaliacoes/Criar";
import PaginaRascunhos from "../pages/Avaliacoes/Rascunhos";
import PaginaVersoes from "../pages/Avaliacoes/Versoes";
import PaginaCorrecoes from "../pages/Avaliacoes/Correcoes";
import PaginaCorrecaoDetalhe from "../pages/Avaliacoes/CorrecaoDetalhe";


export default function AppRoutes() {
    return (
        <Routes>
            {/* Redireciona raiz */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Rotas públicas */}
            <Route path="/cadastrar" element={<Cadastro />} />
            <Route path="/verify" element={<VerificarToken />} />
            <Route path="/login" element={<Login />} />
            <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
            <Route path="/reset-password" element={<RedefinirSenha />} />

            {/* Rotas protegidas (com Header) */}
            <Route element={<LayoutProtegido />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/questoes" element={<ListagemQuestoes />} />
                <Route
                    path="/questoes/privadas"
                    element={<ListagemQuestoesPrivadas />}
                />
                <Route path="/questoes/criar" element={<CriarQuestao />} />
                <Route path="/questoes/:id" element={<DetalheQuestao />} />
                <Route
                    path="/questoes/:id/editar"
                    element={<EditarQuestao />}
                />
                <Route path="/turmas" element={<TurmasPage />} />
                <Route path="/avaliacoes" element={<PaginaAvaliacoes />} />
                <Route path="/avaliacoes/criar" element={<CriarAvaliacao />} />
                <Route path="/avaliacoes/rascunhos" element={<PaginaRascunhos />} />
                <Route path="/avaliacoes/:id/versoes" element={<PaginaVersoes />} />
                <Route path="/avaliacoes/:id/correcoes" element={<PaginaCorrecoes />} />
                <Route path="/correcoes/:id" element={<PaginaCorrecaoDetalhe />} />
            </Route>
        </Routes>
    );
}
