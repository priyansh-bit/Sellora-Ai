import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { useStore, COUNTRIES } from '@/src/store/useStore';
import { Plus, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Billing() {
  const { invoices, addInvoice, products, user } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');

  const currencySymbol = COUNTRIES.find(c => c.code === user?.country)?.symbol || '$';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find(p => p.id === selectedProduct);
    if (product && customerName && quantity) {
      const qty = Number(quantity);
      const total = product.price * qty;
      
      addInvoice({
        date: new Date().toISOString(),
        customerName,
        items: [{ productId: product.id, quantity: qty, price: product.price, total }],
        total
      });
      
      setCustomerName('');
      setSelectedProduct('');
      setQuantity('1');
      setIsCreating(false);
    }
  };

  const handleDownloadPDF = (invoice: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Primary color
    doc.text('SELLORA', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('123 Business Avenue, Suite 100', 14, 30);
    doc.text('San Francisco, CA 94107', 14, 35);
    
    // Invoice Details
    doc.setFontSize(20);
    doc.setTextColor(0);
    doc.text('INVOICE', 140, 22);
    
    doc.setFontSize(10);
    doc.text(`Invoice Number: ${invoice.id}`, 140, 30);
    doc.text(`Date: ${format(new Date(invoice.date), 'MMM dd, yyyy')}`, 140, 35);
    
    // Bill To
    doc.setFontSize(12);
    doc.setFont('', 'bold');
    doc.text('Bill To:', 14, 50);
    doc.setFont('', 'normal');
    doc.setFontSize(11);
    doc.text(invoice.customerName, 14, 57);
    
    // Table
    const tableData = invoice.items.map((item: any) => {
      const product = products.find(p => p.id === item.productId);
      return [
        product?.name || 'Unknown Product',
        item.quantity.toString(),
        `${currencySymbol}${item.price.toFixed(2)}`,
        `${currencySymbol}${item.total.toFixed(2)}`
      ];
    });

    autoTable(doc, {
      startY: 70,
      head: [['Description', 'Quantity', 'Unit Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY || 70;
    doc.setFontSize(12);
    doc.setFont('', 'bold');
    doc.text(`Total Amount: ${currencySymbol}${invoice.total.toFixed(2)}`, 140, finalY + 15);
    
    // Footer
    doc.setFontSize(10);
    doc.setFont('', 'normal');
    doc.setTextColor(150);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });

    doc.save(`Invoice_${invoice.id}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
          <p className="text-muted-foreground mt-1">Manage invoices and customer billing.</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" /> Create Invoice
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>New Invoice</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name</label>
                <Input 
                  value={customerName} 
                  onChange={e => setCustomerName(e.target.value)} 
                  placeholder="e.g. Acme Corp" 
                  required 
                />
              </div>
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Product</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedProduct}
                    onChange={e => setSelectedProduct(e.target.value)}
                    required
                  >
                    <option value="">Select a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - {currencySymbol}{p.price}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 w-32">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input 
                    type="number" 
                    min="1"
                    value={quantity} 
                    onChange={e => setQuantity(e.target.value)} 
                    required 
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit">Generate Invoice</Button>
                <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {invoice.id}
                </TableCell>
                <TableCell>{format(new Date(invoice.date), 'MMM dd, yyyy')}</TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{currencySymbol}{invoice.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDownloadPDF(invoice)}>
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No invoices generated yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
