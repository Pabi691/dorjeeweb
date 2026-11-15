// Read on every call so a role change takes effect without a full reload.
export const getUserRole = () => {
  try {
    return localStorage.getItem('role');
  } catch {
    return null;
  }
};

export const isDistributor = () => getUserRole() === 'distributor';
