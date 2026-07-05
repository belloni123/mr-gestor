export type MonthlyPoint = {
  month: string;
  receita: number;
  recebido: number;
  despesas: number;
};

export type Slice = {
  name: string;
  value: number;
};

export type FinancialItem = {
  cliente: string;
  descricao: string;
  vencimento: string;
  valor: number;
  status: "Em dia" | "Vence hoje" | "Vencido" | "Pago" | "Agendado";
};

export type Alert = {
  title: string;
  text: string;
  tone: "critical" | "warning" | "good";
};

export type DashboardCompany = {
  id: string;
  name: string;
  legalName: string;
  segment: string;
  owner: string;
  status: "Ativa" | "Implantação";
  accent: string;
  integrations: {
    asaas: "Conectado" | "Pendente";
    contaAzul: "Conectado" | "Pendente";
  };
  metrics: {
    receita: number;
    recebido: number;
    aReceber: number;
    vencido: number;
    aPagar: number;
    caixa: number;
    resultado: number;
    clientes: number;
    ticket: number;
  };
  monthly: MonthlyPoint[];
  receitas: Slice[];
  despesas: Slice[];
  receivables: FinancialItem[];
  payables: FinancialItem[];
  alerts: Alert[];
};
