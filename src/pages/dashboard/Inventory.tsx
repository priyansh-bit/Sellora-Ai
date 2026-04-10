import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/src/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { Badge } from '@/src/components/ui/Badge';
import { useStore, COUNTRIES, Product } from '@/src/store/useStore';
import { Plus, AlertCircle, Upload, FileSpreadsheet, Minus, Mail, Image as ImageIcon, Pencil, X, UploadCloud } from 'lucide-react';

export function Inventory() {
  const { products, addProduct, updateStock, updateProduct, user } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', image: '' });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // CSV Import States
  const [csvPreview, setCsvPreview] = useState<Array<{name: string, price: number, stock: number}>>([]);
  const [csvError, setCsvError] = useState('');

  const currencySymbol = COUNTRIES.find(c => c.code === user?.country)?.symbol || '$';

  // Function to handle sending emails about low stock
  const sendLowStockEmail = async (product: { name: string; stock: number }) => {
    console.log(`[EMAIL SERVICE] Preparing low stock alert for ${product.name}...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const emailData = {
      to: 'store-owner@sellora.com',
      subject: `🚨 Low Stock Alert: ${product.name}`,
      body: `The stock for "${product.name}" has dropped to ${product.stock} units. Please restock soon to avoid missing out on sales.`
    };
    console.log('[EMAIL SENT]', emailData);
    alert(`📧 Email Notification Sent!\n\nTo: ${emailData.to}\nSubject: ${emailData.subject}\n\n${emailData.body}`);
  };

  const handleStockChange = (productId: string, oldStock: number, newStock: number) => {
    if (newStock < 0) return;
    updateStock(productId, newStock);
    if (newStock < 10 && oldStock >= 10) {
      const product = products.find(p => p.id === productId);
      if (product) {
        sendLowStockEmail({ name: product.name, stock: newStock });
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEditing && editingProduct) {
          setEditingProduct({ ...editingProduct, image: reader.result as string });
        } else {
          setNewProduct({ ...newProduct, image: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.stock) {
      addProduct({
        name: newProduct.name,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock),
        image: newProduct.image
      });
      setNewProduct({ name: '', price: '', stock: '', image: '' });
      setIsAdding(false);
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: editingProduct.name,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        image: editingProduct.image
      });
      setEditingProduct(null);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter(line => line.trim() !== '');
      const parsedData = [];
      let error = '';

      let startIndex = 0;
      if (lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('price')) {
        startIndex = 1;
      }

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map(s => s.trim());
        if (parts.length < 3) {
          error = `Row ${i + 1} is missing data. Format should be: Name, Price, Stock`;
          break;
        }
        
        const [name, priceStr, stockStr] = parts;
        const price = parseFloat(priceStr);
        const stock = parseInt(stockStr, 10);

        if (!name || isNaN(price) || isNaN(stock)) {
          error = `Row ${i + 1} has invalid data. Ensure Name is text, and Price/Stock are numbers.`;
          break;
        }

        parsedData.push({ name, price, stock });
      }

      if (error) {
        setCsvError(error);
        setCsvPreview([]);
      } else if (parsedData.length === 0) {
        setCsvError('No valid data found in the CSV.');
        setCsvPreview([]);
      } else {
        setCsvError('');
        setCsvPreview(parsedData);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    csvPreview.forEach(item => {
      addProduct({
        name: item.name,
        price: item.price,
        stock: item.stock
      });
    });
    setCsvPreview([]);
    setIsBulkAdding(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground mt-1">Manage your products and stock levels.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setIsBulkAdding(!isBulkAdding); setIsAdding(false); setCsvPreview([]); setCsvError(''); }}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Bulk Add
          </Button>
          <Button onClick={() => { setIsAdding(!isAdding); setIsBulkAdding(false); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Image</label>
                  <div className="flex items-center gap-2">
                    {newProduct.image ? (
                      <img src={newProduct.image} alt="Preview" className="h-10 w-10 rounded object-cover border" />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center border border-dashed">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      className="w-48"
                    />
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Product Name</label>
                  <Input 
                    value={newProduct.name} 
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                    placeholder="e.g. Wireless Mouse" 
                    required 
                  />
                </div>
                <div className="space-y-2 w-32">
                  <label className="text-sm font-medium">Price ({currencySymbol})</label>
                  <Input 
                    type="number" 
                    value={newProduct.price} 
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                    placeholder="0.00" 
                    required 
                  />
                </div>
                <div className="space-y-2 w-32">
                  <label className="text-sm font-medium">Stock</label>
                  <Input 
                    type="number" 
                    value={newProduct.stock} 
                    onChange={e => setNewProduct({...newProduct, stock: e.target.value})} 
                    placeholder="0" 
                    required 
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save Product</Button>
                <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isBulkAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Import Products via CSV</CardTitle>
            <CardDescription>Upload a CSV file with columns: <strong>Name, Price, Stock</strong></CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {csvPreview.length === 0 ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 bg-muted/20">
                <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">Select your CSV file to preview and import</p>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="max-w-xs"
                />
                {csvError && <p className="text-sm text-destructive mt-4">{csvError}</p>}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border max-h-[300px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {csvPreview.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{currencySymbol}{item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.stock}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleConfirmImport}>
                    <Upload className="mr-2 h-4 w-4" /> Confirm Import ({csvPreview.length} products)
                  </Button>
                  <Button variant="ghost" onClick={() => { setCsvPreview([]); setCsvError(''); }}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover border" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-muted flex items-center justify-center border">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{currencySymbol}{product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 rounded-full" 
                      onClick={() => handleStockChange(product.id, product.stock, product.stock - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{product.stock}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7 rounded-full" 
                      onClick={() => handleStockChange(product.id, product.stock, product.stock + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {product.stock < 10 ? (
                    <Badge variant="destructive" className="flex w-fit items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Low Stock
                    </Badge>
                  ) : (
                    <Badge variant="secondary">In Stock</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => setEditingProduct(product)}>
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No products found. Add your first product to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Edit Product</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setEditingProduct(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Image</label>
                  <div className="flex items-center gap-4">
                    {editingProduct.image ? (
                      <img src={editingProduct.image} alt="Preview" className="h-16 w-16 rounded object-cover border" />
                    ) : (
                      <div className="h-16 w-16 rounded bg-muted flex items-center justify-center border border-dashed">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name</label>
                  <Input 
                    value={editingProduct.name} 
                    onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Price ({currencySymbol})</label>
                    <Input 
                      type="number" 
                      value={editingProduct.price} 
                      onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stock</label>
                    <Input 
                      type="number" 
                      value={editingProduct.stock} 
                      onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})} 
                      required 
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="w-full">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
