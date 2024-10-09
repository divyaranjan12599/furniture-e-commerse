export const formatPrice = (number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};


export const formatAddress = (data) => {
  const { address, city, state, country, pinCode } = data;
  return `${address}, ${city}, ${state} - ${pinCode}, ${country}`;
};

export const getOrderStatusColor = (status) => {
  if (status === 'processing') {
    return 'orange';
  }
  if (status === 'rejected') {
    return 'red';
  }
  return 'green';
};

export const getAdminPrivilegeColor = (privilege) => {
  if (privilege === 'super') {
    return 'green';
  }
  if (privilege === 'moderate') {
    return 'blue';
  }
  if (privilege === 'low') {
    return 'brown';
  }
};
