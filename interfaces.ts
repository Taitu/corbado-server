interface Email {
  ID: string;
  created: string;
  email: string;
  status: string;
  updated: string;
}

interface User {
  ID: string;
  created: string;
  emails: Email[];
  fullName: string;
  name: string;
  phoneNumbers: string[];
  status: string;
  updated: string;
}

export interface ResponseData {
  paging: {
    page: number;
    totalItems: number;
    totalPages: number;
  };
  users: User[];
}