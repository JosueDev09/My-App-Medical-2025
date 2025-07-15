

export function generarChatId(session: any): string {
  if (session?.user?.email) {
    return `user-${session.user.email}`;
  }

  if (session?.user?.id) {
    return `user-${session.user.id}`;
  }

  // Si no hay sesión, usa localStorage o crea uno aleatorio
  if (typeof window !== 'undefined') {
    const localId = localStorage.getItem('anonChatId');
    if (localId) return localId;

    const nuevoId = `anon-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem('anonChatId', nuevoId);
    return nuevoId;
  }

  // Fallback en SSR
  return `anon-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}
