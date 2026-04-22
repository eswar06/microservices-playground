const checkUserExists = (email, users) => {
  if (users.find((u) => u.email === email)) {
    return true;
  }
  return false;
}

module.exports = {
  checkUserExists
}