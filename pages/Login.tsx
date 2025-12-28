
import React, { useState, useEffect } from 'react';
import { useLanguage, usePage } from '../App';
import { useAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

const Login: React.FC = () => {
    const { t } = useLanguage();
    const { setPage } = usePage();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Auto-redirection for authenticated operators
    useEffect(() => {
        if (user && !authLoading) {
            setPage('home');
        }
    }, [user, authLoading, setPage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
            setPage('home');
        } catch (err: any) {
            setLoading(false);
            console.error("Login error:", err);
            setError(t({
                en: 'Invalid credentials. Please verify your Operator ID/Passkey.',
                fr: 'Identifiants invalides. Veuillez vérifier votre ID Opérateur/Clé d\'accès.'
            }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 relative pt-24 pb-12">
            {/* Protocol Initialization Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-fade-in" />
                    <div className="relative text-center space-y-4 animate-window-pop pointer-events-auto">
                        <div className="w-24 h-24 mx-auto relative">
                            <iconify-icon icon="ph:fingerprint-simple-bold" className="text-6xl text-brand-accent animate-pulse" />
                            <div className="absolute inset-0 border-4 border-brand-accent/20 rounded-full animate-pulse-sonar" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-white font-bold tracking-[0.3em] uppercase text-sm">Authenticating</h3>
                            <p className="text-brand-accent text-[10px] font-mono animate-pulse">VERIFYING OPERATOR CLEARANCE...</p>
                        </div>
                    </div>
                </div>
            )}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="glass w-full max-w-md p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden animate-window-pop z-10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-50" />

                <div className="text-center mb-10 space-y-2">
                    <div className="w-16 h-16 mx-auto bg-black text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg border border-white/10 relative group">
                        <div className="absolute inset-0 border-2 border-brand-accent/30 rounded-2xl animate-pulse-sonar" />
                        <iconify-icon icon="ph:fingerprint-simple-bold" width="32" className="relative z-10 text-brand-accent group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                        {t({ en: 'System Access', fr: 'Accès Système' })}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-antonio tracking-wide uppercase">
                        {t({ en: 'Identify to proceed to Kaza X Core', fr: 'Identifiez-vous pour accéder au Cœur Kaza X' })}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-brand-accent transition-colors">
                            {t({ en: 'Operator ID / Email', fr: 'ID Opérateur / Email' })}
                        </label>
                        <div className="relative overflow-hidden rounded-xl">
                            <iconify-icon icon="ph:user-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/50 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-500/70 dark:placeholder:text-gray-400/70 text-gray-900 dark:text-gray-100 shadow-sm hover:bg-white/10 hover:border-black/30 dark:hover:border-white/30"
                                placeholder="operator@kazaxlabs.com"
                            />
                            <div className="scan-beam opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <div className="flex justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover:text-brand-accent transition-colors">
                                {t({ en: 'Passkey', fr: 'Clé d\'accès' })}
                            </label>
                            <a href="#" className="text-[10px] text-gray-500 dark:text-gray-400 hover:text-brand-accent transition-colors">
                                {t({ en: 'Lost Key?', fr: 'Clé Perdue ?' })}
                            </a>
                        </div>
                        <div className="relative overflow-hidden rounded-xl">
                            <iconify-icon icon="ph:lock-key-bold" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-black/10 dark:border-white/10 rounded-xl pl-12 pr-12 py-3 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/50 focus:bg-white/10 transition-all duration-300 placeholder:text-gray-500/70 dark:placeholder:text-gray-400/70 text-gray-900 dark:text-gray-100 shadow-sm hover:bg-white/10 hover:border-black/30 dark:hover:border-white/30"
                                placeholder="••••••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-accent transition-colors focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <iconify-icon icon={showPassword ? "ph:eye-slash-bold" : "ph:eye-bold"} width="20" />
                            </button>
                            <div className="scan-beam opacity-0 group-focus-within:opacity-100 transition-opacity" />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest p-4 rounded-xl animate-shake flex items-start gap-3">
                            <iconify-icon icon="ph:warning-circle-bold" className="text-sm mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-mono opacity-80">PROTOCOL_FAILURE:</p>
                                <p>{error}</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group"
                    >
                        <span className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                            {t({ en: 'Authenticate', fr: 'Authentifier' })}
                            <iconify-icon icon="ph:arrow-right-bold" />
                        </span>
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <iconify-icon icon="ph:spinner-gap-bold" className="animate-spin text-xl" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-brand-accent/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-gray-600 dark:text-gray-400">
                        {t({ en: 'New to the protocol?', fr: 'Nouveau sur le protocole ?' })}{' '}
                        <button onClick={() => setPage('signup')} className="font-bold text-brand-accent hover:underline uppercase tracking-wider">
                            {t({ en: 'Initialize', fr: 'Initialiser' })}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
