"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Shield,
  Key,
  UserPlus,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export default function UserAuthentication() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin Sistema",
      email: "admin@olivercoffee.com",
      role: "admin",
      status: "ativo",
      lastLogin: "2024-01-15 14:30",
    },
    {
      id: 2,
      name: "João Gerente",
      email: "joao@olivercoffee.com",
      role: "manager",
      status: "ativo",
      lastLogin: "2024-01-15 09:15",
    },
    {
      id: 3,
      name: "Maria Operadora",
      email: "maria@olivercoffee.com",
      role: "operator",
      status: "inativo",
      lastLogin: "2024-01-10 16:20",
    },
  ]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "operator",
    password: "",
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    strongPasswords: true,
    sessionTimeout: 30,
    loginAttempts: 3,
  });
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    {
      value: "admin",
      label: "Administrador",
      permissions: ["Todas as permissões"],
    },
    {
      value: "manager",
      label: "Gerente",
      permissions: ["Visualizar", "Editar", "Relatórios"],
    },
    {
      value: "operator",
      label: "Operador",
      permissions: ["Visualizar", "Editar Estoque"],
    },
    {
      value: "viewer",
      label: "Visualizador",
      permissions: ["Apenas Visualizar"],
    },
  ];

  const permissions = {
    admin: [
      "dashboard",
      "inventory",
      "suppliers",
      "orders",
      "reports",
      "users",
      "settings",
    ],
    manager: ["dashboard", "inventory", "suppliers", "orders", "reports"],
    operator: ["dashboard", "inventory"],
    viewer: ["dashboard"],
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewUser({ ...newUser, password });
  };

  const addUser = () => {
    if (newUser.name && newUser.email && newUser.password) {
      const user = {
        id: users.length + 1,
        ...newUser,
        status: "ativo",
        lastLogin: "Nunca",
      };
      setUsers([...users, user]);
      setNewUser({ name: "", email: "", role: "operator", password: "" });
      alert("Usuário adicionado com sucesso!");
    }
  };

  const toggleUserStatus = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "ativo" ? "inativo" : "ativo" }
          : user
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`transition-colors duration-300 ${
            theme === "dark"
              ? "border-gray-700 hover:bg-gray-800 text-gray-200"
              : "border-gray-300 hover:bg-gray-100 text-gray-700"
          }`}
        >
          <Users className="h-4 w-4 mr-2" />
          Usuários
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`max-w-6xl max-h-[80vh] overflow-y-auto ${
          theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white"
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={theme === "dark" ? "text-gray-100" : "text-gray-900"}
          >
            Gerenciamento de Usuários
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Usuários */}
          <div className="lg:col-span-2">
            <Card
              className={
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Usuários do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-500">
                              Último acesso: {user.lastLogin}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "outline"
                          }
                        >
                          {roles.find((r) => r.value === user.role)?.label}
                        </Badge>
                        <Badge
                          variant={
                            user.status === "ativo" ? "default" : "secondary"
                          }
                        >
                          {user.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === "ativo" ? "Desativar" : "Ativar"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Adicionar Usuário */}
          <div>
            <Card
              className={
                theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Novo Usuário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className={
                      theme === "dark" ? "bg-gray-700 border-gray-600" : ""
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className={
                      theme === "dark" ? "bg-gray-700 border-gray-600" : ""
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Função</label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger
                      className={
                        theme === "dark" ? "bg-gray-700 border-gray-600" : ""
                      }
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Senha</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        className={
                          theme === "dark" ? "bg-gray-700 border-gray-600" : ""
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generatePassword}
                    >
                      <Key className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button onClick={addUser} className="w-full">
                  Adicionar Usuário
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Matriz de Permissões */}
        <Card
          className={
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Matriz de Permissões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Função</th>
                    <th className="text-center p-2">Dashboard</th>
                    <th className="text-center p-2">Inventário</th>
                    <th className="text-center p-2">Fornecedores</th>
                    <th className="text-center p-2">Pedidos</th>
                    <th className="text-center p-2">Relatórios</th>
                    <th className="text-center p-2">Usuários</th>
                    <th className="text-center p-2">Configurações</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.value} className="border-b">
                      <td className="p-2 font-medium">{role.label}</td>
                      {[
                        "dashboard",
                        "inventory",
                        "suppliers",
                        "orders",
                        "reports",
                        "users",
                        "settings",
                      ].map((perm) => (
                        <td key={perm} className="text-center p-2">
                          {permissions[role.value]?.includes(perm) ? (
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800"
                            >
                              ✓
                            </Badge>
                          ) : (
                            <Badge variant="secondary">✗</Badge>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card
          className={
            theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50"
          }
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticação de Dois Fatores</p>
                    <p className="text-sm text-gray-600">
                      Exigir 2FA para todos os usuários
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactor}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        twoFactor: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Senhas Fortes</p>
                    <p className="text-sm text-gray-600">
                      Exigir senhas complexas
                    </p>
                  </div>
                  <Switch
                    checked={securitySettings.strongPasswords}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({
                        ...securitySettings,
                        strongPasswords: checked,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Timeout da Sessão (minutos)
                  </label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        sessionTimeout: Number.parseInt(e.target.value),
                      })
                    }
                    className={
                      theme === "dark" ? "bg-gray-700 border-gray-600" : ""
                    }
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Tentativas de Login
                  </label>
                  <Input
                    type="number"
                    value={securitySettings.loginAttempts}
                    onChange={(e) =>
                      setSecuritySettings({
                        ...securitySettings,
                        loginAttempts: Number.parseInt(e.target.value),
                      })
                    }
                    className={
                      theme === "dark" ? "bg-gray-700 border-gray-600" : ""
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
