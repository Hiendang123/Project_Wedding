"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import axios from "axios"
import { API_ENDPOINTS } from "@/app/config/api"
import { Template } from "@/interface/Template"

// Danh sách các bộ lọc
const filters = {
  categories: ["Tất cả", "Sang trọng", "Lãng mạn", "Tối giản", "Hoa", "Vintage", "Hiện đại"],
  prices: ["Tất cả", "Miễn phí", "Trả phí"],
}

// Mapping cho categories và prices
const categoryMap: { [key: string]: string } = {
  "tất cả": "all",
  "sang trọng": "elegant",
  "lãng mạn": "romantic",
  "tối giản": "minimalist",
  "hoa": "floral",
  "vintage": "vintage",
  "hiện đại": "modern"
};

const priceMap: { [key: string]: string } = {
  "tất cả": "all",
  "miễn phí": "free",
  "trả phí": "paid"
};

interface ApiResponse {
  templates: Template[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Hàm lấy danh sách templates
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(API_ENDPOINTS.templates, {
        params: {
          search: searchTerm,
          category: selectedCategory,
          price: selectedPrice,
          sort: sortBy,
          page: currentPage,
          limit: 12
        }
      });
      setTemplates(response.data.templates);
      setTotalPages(response.data.totalPages);
      setTotalItems(response.data.totalItems);
      setError(null);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      setError(error.response?.data?.message || "Lỗi khi tải danh sách mẫu thiệp");
      setTemplates([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi các tham số thay đổi
  useEffect(() => {
    fetchTemplates();
  }, [searchTerm, selectedCategory, selectedPrice, sortBy, currentPage]);

  // Hàm xử lý tìm kiếm
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  // Hàm xử lý sắp xếp
  const handleSort = (value: string) => {
    setSortBy(value);
  };

  // Hàm xử lý lọc theo danh mục
  const handleCategoryFilter = (value: string) => {
    setSelectedCategory(categoryMap[value.toLowerCase()] || "all");
  };

  // Hàm xử lý lọc theo giá
  const handlePriceFilter = (value: string) => {
    setSelectedPrice(priceMap[value.toLowerCase()] || "all");
  };

  // Hàm xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mẫu thiệp cưới</h1>
          <div className="flex items-center gap-4">
            <div className="ml-4 text-sm text-gray-500">
              {templates.length} / {totalItems}
            </div>
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm mẫu thiệp..."
                className="pl-10 border-gray-300 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-500"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="w-[180px] border-gray-300 dark:border-gray-700">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                <SelectItem value="name-asc">Tên A-Z</SelectItem>
                <SelectItem value="name-desc">Tên Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="relative md:hidden mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm mẫu thiệp..."
            className="pl-10 border-gray-300 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-500"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Filter and Templates Grid */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>
                <Button
                  variant="outline"
                  className="text-xs h-8 border-gray-300 dark:border-gray-700 hover:border-pink-500 hover:text-pink-500"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedPrice("all");
                  }}
                >
                  <X className="h-3 w-3 mr-1" />
                  Xóa bộ lọc
                </Button>
              </div>

              <Accordion
                type="multiple"
                defaultValue={["categories", "prices"]}
                className="space-y-4"
              >
                <AccordionItem value="categories" className="border-gray-200 dark:border-gray-800">
                  <AccordionTrigger className="text-base font-medium hover:text-pink-500 py-3">
                    Danh mục
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {filters.categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`category-${category}`}
                            checked={selectedCategory === (category === "Tất cả" ? "all" : categoryMap[category.toLowerCase()])}
                            onCheckedChange={() => handleCategoryFilter(category)}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="prices" className="border-gray-200 dark:border-gray-800">
                  <AccordionTrigger className="text-base font-medium hover:text-pink-500 py-3">
                    Giá
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-1">
                      {filters.prices.map((price) => (
                        <div key={price} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`price-${price}`}
                            checked={selectedPrice === (price === "Tất cả" ? "all" : priceMap[price.toLowerCase()])}
                            onCheckedChange={() => handlePriceFilter(price)}
                          />
                          <label
                            htmlFor={`price-${price}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {price}
                          </label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Mobile Filters */}
          <div className="md:hidden mb-6 flex justify-between items-center">
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 border-gray-300 dark:border-gray-700">
                    <Filter className="h-4 w-4" />
                    Bộ lọc
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Bộ lọc</SheetTitle>
                    <SheetDescription>Lọc mẫu thiệp theo danh mục và giá.</SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <Accordion
                      type="multiple"
                      defaultValue={["categories", "prices"]}
                      className="space-y-4"
                    >
                      <AccordionItem value="categories" className="border-gray-200 dark:border-gray-800">
                        <AccordionTrigger className="text-base font-medium hover:text-pink-500 py-3">
                          Danh mục
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-1">
                            {filters.categories.map((category) => (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`mobile-category-${category}`}
                                  checked={selectedCategory === category.toLowerCase()}
                                  onCheckedChange={() => handleCategoryFilter(category.toLowerCase())}
                                />
                                <label
                                  htmlFor={`mobile-category-${category}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {category}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="prices" className="border-gray-200 dark:border-gray-800">
                        <AccordionTrigger className="text-base font-medium hover:text-pink-500 py-3">
                          Giá
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-1">
                            {filters.prices.map((price) => (
                              <div key={price} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`mobile-price-${price}`}
                                  checked={selectedPrice === price.toLowerCase()}
                                  onCheckedChange={() => handlePriceFilter(price.toLowerCase())}
                                />
                                <label
                                  htmlFor={`mobile-price-${price}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {price}
                                </label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">Áp dụng bộ lọc</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={handleSort}>
                <SelectTrigger className="w-[140px] border-gray-300 dark:border-gray-700">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                  <SelectItem value="name-asc">Tên A-Z</SelectItem>
                  <SelectItem value="name-desc">Tên Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              {selectedCategory !== "all" && (
                <Badge variant="outline" className="flex items-center gap-1 border-gray-300 dark:border-gray-700">
                  {selectedCategory}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                </Badge>
              )}
              {selectedPrice !== "all" && (
                <Badge variant="outline" className="flex items-center gap-1 border-gray-300 dark:border-gray-700">
                  {selectedPrice}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedPrice("all")} />
                </Badge>
              )}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-8">{error}</div>
            ) : !templates || templates.length === 0 ? (
              <div className="text-center text-gray-500 py-8">Không tìm thấy mẫu thiệp nào</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templates.map((template) => (
                  <Link key={template._id} href={`/templates/${template._id}`} className="group">
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 mb-3">
                      <Image
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.name}
                        width={225}
                        height={400}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-pink-600 hover:bg-pink-700">
                        {template.price === "free" ? "Miễn phí" : "Trả phí"}
                      </Badge>
                    </div>
                    <h3 className="font-medium group-hover:text-pink-500 transition mb-1">{template.name}</h3>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  className="w-9 h-9 p-0 border-gray-300 dark:border-gray-700" 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <span className="sr-only">Trang trước</span>
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant="outline"
                    className={`w-9 h-9 p-0 border-gray-300 dark:border-gray-700 ${
                      currentPage === page ? "bg-pink-50 dark:bg-pink-950 border-pink-500 text-pink-500" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button 
                  variant="outline" 
                  className="w-9 h-9 p-0 border-gray-300 dark:border-gray-700"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <span className="sr-only">Trang sau</span>
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
