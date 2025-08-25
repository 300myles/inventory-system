-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de itens do inventário
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    current_stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    max_stock INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(50) NOT NULL,
    cost_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0,
    supplier VARCHAR(255) NOT NULL,
    last_restocked DATE NOT NULL,
    expiry_date DATE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    barcode VARCHAR(100),
    description TEXT,
    image VARCHAR(500),
    reorder_point INTEGER NOT NULL DEFAULT 0,
    lead_time INTEGER NOT NULL DEFAULT 0,
    avg_daily_usage DECIMAL(8,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    total_orders INTEGER DEFAULT 0,
    last_order_date DATE,
    payment_terms VARCHAR(100) NOT NULL,
    delivery_time INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos de compra
CREATE TABLE IF NOT EXISTS purchase_orders (
    id VARCHAR(50) PRIMARY KEY,
    supplier VARCHAR(255) NOT NULL,
    items JSONB NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pendente', 'aprovado', 'enviado', 'entregue', 'cancelado', 'parcial')),
    order_date DATE NOT NULL,
    expected_delivery DATE NOT NULL,
    actual_delivery DATE,
    notes TEXT,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('baixa', 'media', 'alta', 'urgente')),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de movimentações de estoque
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('entrada', 'saida', 'ajuste', 'vencido', 'danificado')),
    quantity INTEGER NOT NULL,
    reason TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    user VARCHAR(255) NOT NULL,
    reference VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(50) NOT NULL CHECK (type IN ('estoque_baixo', 'vencimento', 'status_pedido', 'sistema', 'fornecedor')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    read BOOLEAN DEFAULT false,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('baixa', 'media', 'alta')),
    action_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_inventory_items_category ON inventory_items(category);
CREATE INDEX IF NOT EXISTS idx_inventory_items_supplier ON inventory_items(supplier);
CREATE INDEX IF NOT EXISTS idx_inventory_items_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_items_barcode ON inventory_items(barcode);
CREATE INDEX IF NOT EXISTS idx_inventory_items_current_stock ON inventory_items(current_stock);
CREATE INDEX IF NOT EXISTS idx_inventory_items_expiry_date ON inventory_items(expiry_date);

CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_email ON suppliers(email);
CREATE INDEX IF NOT EXISTS idx_suppliers_is_active ON suppliers(is_active);

CREATE INDEX IF NOT EXISTS idx_purchase_orders_supplier ON purchase_orders(supplier);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_order_date ON purchase_orders(order_date);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_priority ON purchase_orders(priority);

CREATE INDEX IF NOT EXISTS idx_stock_movements_item_id ON stock_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(date);

CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_date ON notifications(date);

-- Triggers para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir tudo por enquanto - ajustar conforme necessário)
CREATE POLICY "Enable all operations for authenticated users" ON inventory_items FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON suppliers FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON purchase_orders FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON stock_movements FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON notifications FOR ALL USING (true);

-- Inserir dados de exemplo (opcional)
INSERT INTO suppliers (name, contact, email, phone, address, rating, payment_terms, delivery_time) VALUES
('Importadora Highland Coffee', 'Sarah Mitchell', 'sarah@highlandcoffee.com', '(11) 3123-4567', 'Rua dos Grãos de Café, 2847, São Paulo, SP 01234-567', 4.9, '30 dias', 14),
('South American Coffee Co.', 'Carlos Rodriguez', 'carlos@sacoffee.com', '(21) 2234-5678', 'Av. Importação, 1523, Rio de Janeiro, RJ 20001-234', 4.7, '15 dias', 10),
('EcoPackaging Solutions', 'Jennifer Green', 'jennifer@ecopack.com', '(11) 3345-6789', 'Rua Sustentável, 789, São Paulo, SP 04567-890', 4.6, '30 dias', 7),
('Laticínios Vale Verde', 'Michael Thompson', 'mike@valeverde.com', '(19) 3456-7890', 'Estrada da Fazenda, 456, Campinas, SP 13000-123', 4.8, '7 dias', 2)
ON CONFLICT DO NOTHING;

INSERT INTO inventory_items (
    name, category, current_stock, min_stock, max_stock, unit, cost_per_unit, 
    supplier, last_restocked, expiry_date, sku, location, barcode, description, 
    image, reorder_point, lead_time, avg_daily_usage
) VALUES
('Grãos Etíopes Yirgacheffe Premium', 'Grãos de Café', 45, 20, 150, 'kg', 52.75, 'Importadora Highland Coffee', '2024-01-20', '2024-07-20', 'ETH-YIR-001', 'Depósito A - Prateleira 1', '1234567890123', 'Café etíope de origem única com notas florais', '/images/coffee-beans-ethiopian.jpg', 25, 14, 2.5),
('Café Colombiano Supremo Torra Escura', 'Grãos de Café', 12, 25, 100, 'kg', 44.25, 'South American Coffee Co.', '2024-01-15', '2024-06-15', 'COL-SUP-002', 'Depósito A - Prateleira 2', '1234567890124', 'Café colombiano encorpado com notas de chocolate', '/images/coffee-beans-colombian.jpg', 30, 10, 3.2),
('Copos de Papel Premium 350ml', 'Suprimentos', 850, 500, 3000, 'unidades', 0.6, 'EcoPackaging Solutions', '2024-01-22', NULL, 'CUP-350ML-004', 'Depósito B - Seção 1', '1234567890126', 'Copos de papel biodegradáveis com marca Oliver Coffee', '/images/paper-cups.jpg', 600, 7, 45),
('Leite Integral Orgânico', 'Laticínios', 18, 25, 60, 'litros', 14.25, 'Laticínios Vale Verde', '2024-01-24', '2024-02-02', 'LEITE-INT-005', 'Geladeira - Prateleira A', '1234567890127', 'Leite integral orgânico fresco de laticínio local', '/images/organic-milk.jpg', 30, 2, 4.5)
ON CONFLICT (sku) DO NOTHING;
