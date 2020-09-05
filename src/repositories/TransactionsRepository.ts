import Transaction from "../models/Transaction";

interface CreateTransactionDTO {
  title: string;
  type: "income" | "outcome";
  value: number;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

enum Type {
  INCOME = "income",
  OUTCOME = "outcome",
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  private calculateBalance(operator: Type): number {
    return this.transactions
      .filter((transaction) => transaction.type === operator)
      .reduce((acc, tr) => acc + tr.value, 0);
  }

  public getBalance(): Balance {
    const income = this.calculateBalance(Type.INCOME);
    const outcome = this.calculateBalance(Type.OUTCOME);
    const total = income - outcome;

    const balance: Balance = { income, outcome, total };

    return balance;
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const { total } = this.getBalance();

    if (type === Type.OUTCOME && total < value) {
      throw Error("Cannot create outcome transaction without a valid balance");
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
