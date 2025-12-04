import { useAuth } from '../contexts/AuthContext';

/**
 * Header Component
 * 
 * Displays the app name, subtitle, and user authentication info.
 */
function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="app-header">
      <div>
        <h1>MyMoney</h1>
        <p>Simple snapshot of my net worth</p>
      </div>
      {user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt={user.displayName}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid #667eea'
                }}
              />
            )}
            <span style={{ fontSize: '0.9rem', color: '#666' }}>
              {user.displayName || user.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#5568d3'}
            onMouseOut={(e) => e.target.style.background = '#667eea'}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;

