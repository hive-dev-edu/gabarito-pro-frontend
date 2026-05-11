import { Link } from "react-router-dom";

import Header from "../../shared/components/Header";

export default function NotFound() {

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="max-w-7xl mx-auto px-3 sm:px-4 py-10">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Página não encontrada
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">
                        A rota que você tentou acessar não existe ou foi movida.
                    </p>

                    <div className="mt-6">
                        <Link
                            to="/dashboard"
                            type="button"
                            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        >
                            Voltar para o dashboard
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
