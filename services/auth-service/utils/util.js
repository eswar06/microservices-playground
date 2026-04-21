export const checkUserExists = (email, users) => {
  if (users.find((u) => u.email === email)) {
    throw new Error("User already exists");
  }
}