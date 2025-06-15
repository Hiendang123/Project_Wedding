const Template = require("../models/Template");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/templates/thumbnails')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Chỉ chấp nhận file ảnh!'), false);
    }
    cb(null, true);
  }
}).single('thumbnail');

// Lấy danh sách templates cho frontend (chỉ hiển thị templates đã xuất bản)
exports.getAllTemplates = async (req, res) => {
  try {
    const { category, price, search, sort, page = 1, limit = 12 } = req.query;
    let query = { status: "published" }; // Chỉ lấy templates đã xuất bản

    // Lọc theo danh mục
    if (category && category !== 'all') {
      query.category = category;
    }

    // Lọc theo giá
    if (price && price !== 'all') {
      query.price = price;
    }

    // Tìm kiếm theo tên
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Sắp xếp
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'popular':
          sortOption = { rating: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        case 'name-asc':
          sortOption = { name: 1 };
          break;
        case 'name-desc':
          sortOption = { name: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    // Tính toán skip và limit cho pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const parsedLimit = parseInt(limit);

    // Lấy tổng số templates để tính tổng số trang
    const totalItems = await Template.countDocuments(query);
    const totalPages = Math.ceil(totalItems / parsedLimit);

    // Lấy templates với pagination
    const templates = await Template.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit)
      .select('-html -css -js -dynamicFields');

    res.status(200).json({
      templates,
      totalPages,
      totalItems,
      currentPage: parseInt(page),
      itemsPerPage: parsedLimit
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ 
      message: "Lỗi khi lấy danh sách mẫu thiệp",
      error: error.message 
    });
  }
};

// Lấy tất cả templates cho admin (hiển thị tất cả)
exports.getAllTemplatesAdmin = async (req, res) => {
  try {
    const { category, price, status, search, sort } = req.query;
    let query = {};

    // Lọc theo danh mục
    if (category && category !== 'all') {
      query.category = category;
    }

    // Lọc theo giá
    if (price && price !== 'all') {
      query.price = price;
    }

    // Lọc theo trạng thái
    if (status && status !== 'all') {
      query.status = status;
    }

    // Tìm kiếm theo tên
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Sắp xếp
    let sortOption = {};
    if (sort) {
      switch (sort) {
        case 'popular':
          sortOption = { rating: -1 };
          break;
        case 'newest':
          sortOption = { createdAt: -1 };
          break;
        case 'rating':
          sortOption = { rating: -1 };
          break;
        case 'name-asc':
          sortOption = { name: 1 };
          break;
        case 'name-desc':
          sortOption = { name: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }

    const templates = await Template.find(query)
      .sort(sortOption)
      .select('-html -css -js -dynamicFields');

    res.status(200).json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ 
      message: "Lỗi khi lấy danh sách mẫu thiệp",
      error: error.message 
    });
  }
};

// Lấy chi tiết một template
exports.getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Không tìm thấy mẫu thiệp" });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ 
      message: "Lỗi khi lấy thông tin mẫu thiệp",
      error: error.message 
    });
  }
};

// Tạo template mới
exports.createTemplate = async (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { name, category, price, status, html, css, js, dynamicFields } = req.body;

      let thumbnailPath = '/templates/thumbnails/default.jpg';
      if (req.file) {
        thumbnailPath = `/templates/thumbnails/${req.file.filename}`;
      }

      let parsedDynamicFields = [];
      if (typeof dynamicFields === 'string') {
        parsedDynamicFields = JSON.parse(dynamicFields);
      } else if (Array.isArray(dynamicFields)) {
        parsedDynamicFields = dynamicFields;
      }

      // Kiểm tra các trường bắt buộc
      if (!name || !category || !html || !css) {
        return res.status(400).json({
          message: "Vui lòng điền đầy đủ thông tin bắt buộc"
        });
      }

      const newTemplate = new Template({
        name,
        category,
        price,
        status,
        html,
        css,
        js,
        dynamicFields: parsedDynamicFields,
        thumbnail: thumbnailPath
      });

      await newTemplate.save();
      res.status(201).json({ 
        message: "Tạo mẫu thiệp thành công",
        template: newTemplate 
      });
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ 
        message: "Lỗi khi tạo mẫu thiệp",
        error: error.message 
      });
    }
  });
};

// Cập nhật template
exports.updateTemplate = async (req, res) => {
  upload(req, res, async function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    try {
      const { name, category, price, priceAmount, comparePrice, status, html, css, js, dynamicFields } = req.body;

      const template = await Template.findById(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Không tìm thấy mẫu thiệp" });
      }

      // Xóa thumbnail cũ nếu có upload thumbnail mới
      if (req.file) {
        const oldThumbnail = template.thumbnail;
        if (oldThumbnail && oldThumbnail !== '/templates/thumbnails/default.jpg') {
          const oldPath = path.join('public', oldThumbnail);
          if (fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
          }
        }
        template.thumbnail = `/templates/thumbnails/${req.file.filename}`;
      }

      // Cập nhật các trường khác
      if (name) template.name = name;
      if (category) template.category = category;
      if (price) template.price = price;
      if (priceAmount !== undefined) template.priceAmount = Number(priceAmount);
      if (comparePrice !== undefined) template.comparePrice = Number(comparePrice);
      if (status) template.status = status;
      if (html) template.html = html;
      if (css) template.css = css;
      if (js) template.js = js;
      if (dynamicFields) template.dynamicFields = dynamicFields;

      await template.save();
      res.status(200).json({ 
        message: "Cập nhật mẫu thiệp thành công",
        template 
      });
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ 
        message: "Lỗi khi cập nhật mẫu thiệp",
        error: error.message 
      });
    }
  });
};

// Cập nhật trạng thái template
exports.updateTemplateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const template = await Template.findById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ message: "Không tìm thấy mẫu thiệp" });
    }

    // Kiểm tra trạng thái hợp lệ
    if (!["draft", "review", "published"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    template.status = status;
    await template.save();

    res.status(200).json({ 
      message: "Cập nhật trạng thái mẫu thiệp thành công",
      template 
    });
  } catch (error) {
    console.error("Error updating template status:", error);
    res.status(500).json({ 
      message: "Lỗi khi cập nhật trạng thái mẫu thiệp",
      error: error.message 
    });
  }
};

// Xóa template (chuyển về trạng thái draft)
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Không tìm thấy mẫu thiệp" });
    }

    // Chuyển template về trạng thái draft
    template.status = "draft";
    await template.save();

    res.status(200).json({ 
      message: "Đã chuyển mẫu thiệp về trạng thái bản nháp",
      template 
    });
  } catch (error) {
    console.error("Error updating template status:", error);
    res.status(500).json({ 
      message: "Lỗi khi cập nhật trạng thái mẫu thiệp",
      error: error.message 
    });
  }
}; 