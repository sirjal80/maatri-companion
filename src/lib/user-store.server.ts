import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { createHash, randomUUID } from "crypto";
import { join } from "path";

const dataDir = join(process.cwd(), "data");
const usersFile = join(dataDir, "users.json");

type StoredUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

function ensureDataStore() {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  if (!existsSync(usersFile)) {
    writeFileSync(usersFile, "[]", "utf8");
  }
}

function loadUsers(): StoredUser[] {
  ensureDataStore();
  try {
    const raw = readFileSync(usersFile, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  ensureDataStore();
  writeFileSync(usersFile, JSON.stringify(users, null, 2) + "\n", "utf8");
}

function hashPassword(password: string) {
  return createHash("sha256").update(password, "utf8").digest("hex");
}

export function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return loadUsers().find((user) => user.email.toLowerCase() === normalized) ?? null;
}

export function createUser(email: string, password: string, name?: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password.trim()) {
    throw new Error("Please provide an email and password.");
  }

  if (findUserByEmail(normalizedEmail)) {
    throw new Error("A user with that email already exists.");
  }

  const user: StoredUser = {
    id: randomUUID(),
    email: normalizedEmail,
    name: name?.trim() || normalizedEmail.split("@")[0] || "User",
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  const users = loadUsers();
  users.push(user);
  saveUsers(users);

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}

export function verifyUser(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user) return null;
  const hash = hashPassword(password);
  if (hash !== user.passwordHash) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  };
}
