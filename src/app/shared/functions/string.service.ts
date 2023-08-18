

export function getFullname(
  firstName: string,
  middleName: string,
  lastName: string,
) {
  let fullName = '';
  if (firstName) {
    fullName = `${firstName}`;
  }
  if (middleName) {
    fullName = `${fullName} ${middleName}`;
  }
  if (lastName) {
    fullName = `${fullName} ${lastName}`;
  }
  return fullName;
}

