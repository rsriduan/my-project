const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DELIED Fashion Platform database...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.liveChatMessage.deleteMany();
  await prisma.liveChatSession.deleteMany();
  await prisma.ticketMessage.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.campaignAttribution.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.orderTimeline.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.financialTransaction.deleteMany();
  await prisma.financialAccount.deleteMany();
  await prisma.productionBatch.deleteMany();
  await prisma.rawMaterial.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.productCosting.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.shareDividend.deleteMany();
  await prisma.shareholderDocument.deleteMany();
  await prisma.shareholderProfile.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.marketerProfile.deleteMany();
  await prisma.moderatorProfile.deleteMany();
  await prisma.withdrawalRequest.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.resellerProfile.deleteMany();
  await prisma.wholesaleProfile.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('delied123', salt);

  // 1. Create Users for all 8 roles
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@delied.com',
      passwordHash: defaultPassword,
      name: 'Mahmudur Rahman (Super Admin)',
      phone: '+8801711000001',
      role: 'ADMIN',
      status: 'ACTIVE',
      district: 'Dhaka',
      upazila: 'Gulshan',
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@delied.com',
      passwordHash: defaultPassword,
      name: 'Tanvir Ahmed',
      phone: '+8801812345678',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      address: 'House 42, Road 11, Banani',
      district: 'Dhaka',
      upazila: 'Banani',
    },
  });

  const resellerUser = await prisma.user.create({
    data: {
      email: 'reseller@delied.com',
      passwordHash: defaultPassword,
      name: 'Sumaiya Akter',
      phone: '+8801912345678',
      role: 'RESELLER',
      status: 'ACTIVE',
      district: 'Chittagong',
      upazila: 'Kotwali',
      resellerProfile: {
        create: {
          businessName: 'Chittagong Fashion Wardrobe',
          tradeLicense: 'TRAD/CTG/2025/8921',
          status: 'APPROVED',
          commissionRate: 15.0,
          walletBalance: 14500.0,
          totalEarned: 38200.0,
          totalWithdrawn: 23700.0,
          bankName: 'City Bank Ltd',
          accountNumber: '1102938472910',
          bkashNumber: '01912345678',
        },
      },
    },
    include: { resellerProfile: true },
  });

  const wholesaleUser = await prisma.user.create({
    data: {
      email: 'wholesale@delied.com',
      passwordHash: defaultPassword,
      name: 'Karim Textiles & Apparel Co.',
      phone: '+8801719876543',
      role: 'WHOLESALE',
      status: 'ACTIVE',
      district: 'Narayanganj',
      upazila: 'Sadar',
      wholesaleProfile: {
        create: {
          companyName: 'Karim Garments & Wholesale Emporium',
          binNumber: '003928172-0102',
          tradeLicense: 'TRAD/NRG/2024/4401',
          tier: 'TIER_1',
          discountPercentage: 25.0,
          minOrderQty: 40,
          creditLimit: 250000.0,
          status: 'APPROVED',
        },
      },
    },
    include: { wholesaleProfile: true },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@delied.com',
      passwordHash: defaultPassword,
      name: 'Rafiqul Islam',
      phone: '+8801715555555',
      role: 'STAFF',
      status: 'ACTIVE',
      district: 'Dhaka',
      upazila: 'Uttara',
      staffProfile: {
        create: {
          employeeId: 'EMP-DELIED-012',
          department: 'OPERATIONS',
          designation: 'Senior Production & Inventory Lead',
          salary: 65000.0,
          permissions: JSON.stringify(['inventory:manage', 'production:manage', 'costing:view', 'expenses:record']),
        },
      },
    },
  });

  const shareholderUser = await prisma.user.create({
    data: {
      email: 'shareholder@delied.com',
      passwordHash: defaultPassword,
      name: 'Syed Shamsul Huda',
      phone: '+8801712223344',
      role: 'SHAREHOLDER',
      status: 'ACTIVE',
      district: 'Dhaka',
      upazila: 'Dhanmondi',
      shareholderProfile: {
        create: {
          totalShares: 75000,
          sharePercentage: 15.0,
          shareCertificateNo: 'SH-DEL-2024-003',
          nomineeName: 'Nasrin Sultana Huda',
          bankDetails: 'Eastern Bank PLC, Gulshan Branch, A/C: 10410029381',
        },
      },
    },
    include: { shareholderProfile: true },
  });

  const moderatorUser = await prisma.user.create({
    data: {
      email: 'moderator@delied.com',
      passwordHash: defaultPassword,
      name: 'Fatema Tuz Zohra',
      phone: '+8801611122233',
      role: 'MODERATOR',
      status: 'ACTIVE',
      district: 'Dhaka',
      upazila: 'Mirpur',
      moderatorProfile: {
        create: {
          department: 'CUSTOMER_SUPPORT',
          shiftSchedule: 'MORNING',
          isOnline: true,
        },
      },
    },
  });

  const marketerUser = await prisma.user.create({
    data: {
      email: 'marketer@delied.com',
      passwordHash: defaultPassword,
      name: 'Arif Hossain',
      phone: '+8801511223344',
      role: 'MARKETER',
      status: 'ACTIVE',
      district: 'Dhaka',
      upazila: 'Badda',
      marketerProfile: {
        create: {
          affiliateCode: 'ARIF_DELIED',
          commissionRate: 6.5,
          totalEarnings: 21850.0,
        },
      },
    },
    include: { marketerProfile: true },
  });

  console.log('✅ Created 8 demo user accounts (Password for all: delied123)');

  // 2. Categories
  const catPanjabi = await prisma.category.create({
    data: {
      name: 'Men\'s Panjabi & Kurta',
      nameBn: 'পুরুষদের পাঞ্জাবি ও কুর্তা',
      slug: 'mens-panjabi-kurta',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop',
      description: 'Handcrafted jacquard, cotton and designer Eid Panjabis with embroidery.',
      sortOrder: 1,
    },
  });

  const catSaree = await prisma.category.create({
    data: {
      name: 'Women\'s Saree & Festive Wear',
      nameBn: 'মহিলাদের শাড়ি ও উৎসবের পোশাক',
      slug: 'womens-saree-festive',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      description: 'Exclusive Jamdani, Muslin, Silk and Designer festive ethnic wear.',
      sortOrder: 2,
    },
  });

  const catPolo = await prisma.category.create({
    data: {
      name: 'Premium Polo & T-Shirts',
      nameBn: 'প্রিমিয়াম পোলো ও টি-শার্ট',
      slug: 'polo-tshirts',
      image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
      description: '100% Pima & Combed Cotton casual luxury polos and tees.',
      sortOrder: 3,
    },
  });

  const catWinter = await prisma.category.create({
    data: {
      name: 'Winter Collection: Hoodies & Jackets',
      nameBn: 'শীতকালীন কালেকশন: হুডি ও জ্যাকেট',
      slug: 'winter-collection',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
      description: 'Fleece hoodies, bomber jackets and layered winter attire for Bangladesh seasons.',
      sortOrder: 4,
    },
  });

  const catShirts = await prisma.category.create({
    data: {
      name: 'Formal & Casual Shirts',
      nameBn: 'ফরমাল ও ক্যাজুয়াল শার্ট',
      slug: 'shirts-casual-formal',
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
      description: 'Wrinkle-free Egyptian cotton office and weekend button-downs.',
      sortOrder: 5,
    },
  });

  // 3. Products & Pricing Engine data
  const productsData = [
    {
      name: 'Royal Indigo Embroidered Jacquard Panjabi',
      nameBn: 'রয়্যাল ইন্ডিগো এমব্রয়ডারিড জাকোয়ার্ড পাঞ্জাবি',
      slug: 'royal-indigo-embroidered-panjabi',
      sku: 'DEL-PAN-001',
      description: 'Crafted from premium 100% Egyptian jacquard cotton, this royal indigo panjabi features intricate minimal collar and placket geometric embroidery. Finished with mother-of-pearl buttons for the modern festive gentleman.',
      descriptionBn: 'প্রিমিয়াম ১০০% মিশরীয় জাকোয়ার্ড তুলা থেকে তৈরি, সূক্ষ্ম কলার ও প্লাকেট এমব্রয়ডারি। ঈদ ও বিশেষ অনুষ্ঠানের জন্য নিখুঁত পছন্দ।',
      regularPrice: 2850,
      discountPrice: 2450,
      wholesalePrice: 1750,
      resellerPrice: 1950,
      suggestedRetailPrice: 2450,
      minWholesaleQty: 25,
      stockQuantity: 120,
      lowStockThreshold: 15,
      status: 'PUBLISHED',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      isWinterCollection: false,
      categoryId: catPanjabi.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?q=80&w=800&auto=format&fit=crop'
      ]),
      sizes: JSON.stringify(['M (38)', 'L (40)', 'XL (42)', 'XXL (44)']),
      colors: JSON.stringify(['Royal Indigo', 'Deep Navy', 'Pure White']),
      specifications: JSON.stringify({
        'Fabric': '100% Jacquard Combed Cotton',
        'Fit': 'Tailored Semi-Slim Fit',
        'Buttons': 'Natural Mother-of-Pearl',
        'Care': 'Dry clean or gentle hand wash with mild detergent',
        'Origin': 'Made in Bangladesh'
      }),
      costing: {
        fabricCost: 650,
        accessoriesCost: 90,
        printingCost: 150,
        labelCost: 25,
        packagingCost: 85,
        labourCost: 220,
        overheadCost: 60,
        otherCost: 20,
        totalCost: 1300,
        notes: 'High margin signature DELIED hero product'
      }
    },
    {
      name: 'Heritage Crimson Jamdani Festive Saree',
      nameBn: 'ঐতিহ্যবাহী ক্রিমসন জামদানি উৎসবের শাড়ি',
      slug: 'heritage-crimson-jamdani-saree',
      sku: 'DEL-SAR-002',
      description: 'Handwoven traditional Dhakai Jamdani saree with gold and silver zari floral motifs. Comes with an unstitched designer blouse piece.',
      descriptionBn: 'হাতে বোনা ঐতিহ্যবাহী ঢাকাই জামদানি শাড়ি, সোনালি ও রুপালি জরির সূক্ষ্ম কাজের মেলবন্ধন। সঙ্গে আনস্টিচড ডিজাইনার ব্লাউজ পিস।',
      regularPrice: 6500,
      discountPrice: 5800,
      wholesalePrice: 4100,
      resellerPrice: 4600,
      suggestedRetailPrice: 5800,
      minWholesaleQty: 10,
      stockQuantity: 45,
      lowStockThreshold: 5,
      status: 'PUBLISHED',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      isWinterCollection: false,
      categoryId: catSaree.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop'
      ]),
      sizes: JSON.stringify(['Standard 12 Haat with Blouse Piece']),
      colors: JSON.stringify(['Crimson Red', 'Emerald Green', 'Royal Gold']),
      specifications: JSON.stringify({
        'Weave': '84-Count Fine Cotton & Silk Blend Handloom',
        'Zari': 'High-grade non-tarnish tested gold zari',
        'Occasion': 'Wedding, Reception, Festive Gala',
        'Care': 'Strictly dry wash recommended'
      }),
      costing: {
        fabricCost: 2200,
        accessoriesCost: 180,
        printingCost: 0,
        labelCost: 30,
        packagingCost: 150,
        labourCost: 650,
        overheadCost: 120,
        otherCost: 50,
        totalCost: 3380,
        notes: 'Master weaver artisan piece'
      }
    },
    {
      name: 'Heavyweight Fleece Winter Hoodie — Charcoal',
      nameBn: 'হেভিওয়েট ফ্লিস উইন্টার হুডি — চারকোল',
      slug: 'heavyweight-fleece-winter-hoodie-charcoal',
      sku: 'DEL-WNT-003',
      description: '380 GSM ultra-soft organic cotton brushed fleece hoodie. Designed with kangaroo pockets, ribbed cuffs and an insulated double-layered hood.',
      descriptionBn: '৩৮০ জিএসএম আল্ট্রা-সফট অর্গানিক কটন ব্রাশড ফ্লিস হুডি। কনকনে শীতে দেবে আরামদায়ক উষ্ণতা ও আধুনিক লুক।',
      regularPrice: 2200,
      discountPrice: 1750,
      wholesalePrice: 1150,
      resellerPrice: 1350,
      suggestedRetailPrice: 1750,
      minWholesaleQty: 30,
      stockQuantity: 280,
      lowStockThreshold: 20,
      status: 'PUBLISHED',
      isFeatured: true,
      isNewArrival: false,
      isBestSeller: true,
      isWinterCollection: true,
      categoryId: catWinter.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop'
      ]),
      sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Charcoal Grey', 'Deep Forest Green', 'Midnight Black']),
      specifications: JSON.stringify({
        'Material': '80% Combed Cotton, 20% Polyester Anti-Pill Fleece',
        'Weight': '380 GSM Heavyweight',
        'Stitching': 'Reinforced twin needle flatlock stitching',
        'Fit': 'Relaxed Streetwear Comfort'
      }),
      costing: {
        fabricCost: 480,
        accessoriesCost: 75,
        printingCost: 40,
        labelCost: 20,
        packagingCost: 60,
        labourCost: 150,
        overheadCost: 45,
        otherCost: 15,
        totalCost: 885,
        notes: 'High volume winter campaign item'
      }
    },
    {
      name: 'Supima Cotton Mercerized Polo Shirt',
      nameBn: 'সুপিমা কটন মার্সারাইজড পোলো শার্ট',
      slug: 'supima-cotton-mercerized-polo-shirt',
      sku: 'DEL-POL-004',
      description: 'Refined 240 GSM double-mercerized cotton polo with crisp non-curling collar and laser-etched DELIED branded buttons.',
      descriptionBn: '২৪০ জিএসএম ডাবল-মার্সারাইজড ১০০% কটন পোলো শার্ট। অফিসে বা ক্যাজুয়াল আড্ডায় অসাধারণ স্টাইল।',
      regularPrice: 1650,
      discountPrice: 1350,
      wholesalePrice: 850,
      resellerPrice: 980,
      suggestedRetailPrice: 1350,
      minWholesaleQty: 50,
      stockQuantity: 195,
      lowStockThreshold: 25,
      status: 'PUBLISHED',
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: true,
      isWinterCollection: false,
      categoryId: catPolo.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop'
      ]),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Classic Navy', 'Burgundy', 'Sage Green', 'Jet Black']),
      specifications: JSON.stringify({
        'Knit': 'Honey-comb pique double mercerized',
        'Colorfastness': 'Level 4.5 wash fastness guaranteed',
        'Collar': 'Structured anti-curl knit rib'
      }),
      costing: {
        fabricCost: 350,
        accessoriesCost: 55,
        printingCost: 30,
        labelCost: 15,
        packagingCost: 45,
        labourCost: 110,
        overheadCost: 35,
        otherCost: 10,
        totalCost: 650,
        notes: 'Essential daily core collection'
      }
    },
    {
      name: 'Oxford Weave Classic Smart Casual Shirt',
      nameBn: 'অক্সফোর্ড উইভ ক্লাসিক স্মার্ট ক্যাজুয়াল শার্ট',
      slug: 'oxford-weave-classic-shirt',
      sku: 'DEL-SHT-005',
      description: '100% long-staple cotton Oxford weave button-down shirt. Features a tailored collar, curved hem and wrinkle-resistant treatment.',
      descriptionBn: '১০০% লং-স্টেপল কটন অক্সফোর্ড ফেব্রিক শার্ট। সারাদিন পরিধানেও কুঁচকে যায় না, দারুণ আরামদায়ক।',
      regularPrice: 1950,
      discountPrice: 1650,
      wholesalePrice: 1050,
      resellerPrice: 1250,
      suggestedRetailPrice: 1650,
      minWholesaleQty: 30,
      stockQuantity: 140,
      lowStockThreshold: 15,
      status: 'PUBLISHED',
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: true,
      isWinterCollection: false,
      categoryId: catShirts.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop'
      ]),
      sizes: JSON.stringify(['38 (S)', '40 (M)', '42 (L)', '44 (XL)']),
      colors: JSON.stringify(['Sky Blue', 'Crisp White', 'Soft Pink']),
      specifications: JSON.stringify({
        'Composition': '100% Combed Compact Oxford Cotton',
        'Collar': 'Button-Down Collar',
        'Placket': 'Classic Front Placket with Pearl Finish Buttons'
      }),
      costing: {
        fabricCost: 450,
        accessoriesCost: 60,
        printingCost: 0,
        labelCost: 20,
        packagingCost: 50,
        labourCost: 140,
        overheadCost: 40,
        otherCost: 15,
        totalCost: 775,
        notes: 'Top re-order product'
      }
    },
    {
      name: 'Quilted Lightweight Bomber Jacket — Midnight',
      nameBn: 'কুইল্টেড লাইটওয়েট বোম্বার জ্যাকেট — মিডনাইট',
      slug: 'quilted-lightweight-bomber-jacket',
      sku: 'DEL-WNT-006',
      description: 'Water-resistant nylon shell with diamond quilted thermo-fill insulation. Ribbed collar and cuffs with secure zippered chest and inner pockets.',
      descriptionBn: 'ওয়াটার-রেজিস্ট্যান্ট নাইলন ফ্যাব্রিক ও ডায়মন্ড কুইল্টিং ইনসুলেশন যুক্ত প্রিমিয়াম বোম্বার জ্যাকেট।',
      regularPrice: 3450,
      discountPrice: 2850,
      wholesalePrice: 1950,
      resellerPrice: 2250,
      suggestedRetailPrice: 2850,
      minWholesaleQty: 20,
      stockQuantity: 85,
      lowStockThreshold: 10,
      status: 'PUBLISHED',
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      isWinterCollection: true,
      categoryId: catWinter.id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop'
      ]),
      sizes: JSON.stringify(['M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['Midnight Blue', 'Olive Drab', 'Matt Black']),
      specifications: JSON.stringify({
        'Outer Shell': 'High-density micro ripstop nylon',
        'Insulation': '120 GSM hollow-fiber synthetic down',
        'Hardware': 'Gunmetal matte YKK zippers'
      }),
      costing: {
        fabricCost: 720,
        accessoriesCost: 160,
        printingCost: 0,
        labelCost: 35,
        packagingCost: 95,
        labourCost: 280,
        overheadCost: 80,
        otherCost: 30,
        totalCost: 1400,
        notes: 'Flagship winter outerwear product'
      }
    }
  ];

  const createdProducts = [];
  for (const p of productsData) {
    const { costing, ...prodData } = p;
    const prod = await prisma.product.create({
      data: {
        ...prodData,
        costing: {
          create: costing
        }
      }
    });
    createdProducts.push(prod);

    // Initial stock movement
    await prisma.stockMovement.create({
      data: {
        productId: prod.id,
        type: 'STOCK_IN',
        quantity: prod.stockQuantity,
        previousStock: 0,
        newStock: prod.stockQuantity,
        reason: 'Initial production inventory intake from warehouse',
        responsibleUserId: staffUser.id,
        reference: `INV-INIT-${prod.sku}`,
      }
    });
  }

  console.log(`✅ Created ${createdProducts.length} premium products with ERP costing and initial inventory!`);

  // 4. Raw Materials & Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Narayanganj Spinning & Dyeing Mills Ltd',
      contactPerson: 'Mr. Zahirul Islam',
      phone: '+8801712998877',
      email: 'sales@narayangani-spin.com',
      address: 'Plot 18, BSCIC Industrial Area, Narayanganj',
      paymentTerms: '30 Days Net Credit',
      totalPurchased: 450000,
      totalPaid: 350000,
      balanceDue: 100000,
    }
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Apex Button & Zipper Industries',
      contactPerson: 'Ms. Nusrat Jahan',
      phone: '+8801819223344',
      email: 'apexacc@dhaka.net',
      address: 'Tejgaon I/A, Dhaka 1208',
      paymentTerms: 'Cash / 15 Days',
      totalPurchased: 120000,
      totalPaid: 120000,
      balanceDue: 0,
    }
  });

  await prisma.rawMaterial.createMany({
    data: [
      {
        name: 'Egyptian Combed Cotton Yarn (60/1 count)',
        sku: 'RAW-COT-601',
        category: 'FABRIC',
        unit: 'KG',
        currentStock: 850,
        minStock: 200,
        unitPrice: 520,
        supplierId: supplier1.id,
      },
      {
        name: 'Natural Mother-of-Pearl 4-hole Buttons',
        sku: 'RAW-BTN-MOP',
        category: 'ACCESSORIES',
        unit: 'PCS',
        currentStock: 12500,
        minStock: 2500,
        unitPrice: 4.5,
        supplierId: supplier2.id,
      },
      {
        name: 'Heavy Brushed 380 GSM Winter Fleece Fabric',
        sku: 'RAW-FLC-380',
        category: 'FABRIC',
        unit: 'METER',
        currentStock: 640,
        minStock: 150,
        unitPrice: 380,
        supplierId: supplier1.id,
      },
      {
        name: 'Delied Signature Gold-Foil Rigid Magnetic Packaging Box',
        sku: 'RAW-BOX-PREM',
        category: 'PACKAGING',
        unit: 'PCS',
        currentStock: 1800,
        minStock: 400,
        unitPrice: 65,
        supplierId: supplier2.id,
      }
    ]
  });

  // 5. Financial Accounts & Initial Balance Sheet
  const primeBank = await prisma.financialAccount.create({
    data: {
      code: 'ACC-BANK-001',
      name: 'Prime Bank Ltd — Corporate Account',
      type: 'BANK',
      balance: 1850000.0,
      bankName: 'Prime Bank Ltd, Gulshan Corporate Branch',
      accountNumber: '2105102938481',
    }
  });

  const bkashMerchant = await prisma.financialAccount.create({
    data: {
      code: 'ACC-MFS-002',
      name: 'bKash Merchant Master Account',
      type: 'BANK',
      balance: 420000.0,
      bankName: 'bKash MFS PGW',
      accountNumber: '01811990011',
    }
  });

  const cashAccount = await prisma.financialAccount.create({
    data: {
      code: 'ACC-CSH-003',
      name: 'Dhaka Head Office Cash In Hand',
      type: 'CASH',
      balance: 85000.0,
    }
  });

  await prisma.financialTransaction.create({
    data: {
      transactionNumber: 'TX-2026-0001',
      accountId: primeBank.id,
      type: 'INCOME',
      amount: 500000,
      category: 'WHOLESALE_RECEIPT',
      reference: 'INV-WS-BENGAL-99',
      description: 'Advance received for bulk Eid Panjabi pre-order',
      createdByUserId: superAdmin.id,
    }
  });

  // 6. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'DELIED10',
        discountType: 'PERCENTAGE',
        discountValue: 10.0,
        minPurchase: 1500,
        maxDiscount: 500,
        validUntil: new Date('2027-12-31'),
        usageLimit: 500,
        timesUsed: 42,
        isActive: true,
      },
      {
        code: 'EID2026',
        discountType: 'FIXED',
        discountValue: 300,
        minPurchase: 2500,
        validUntil: new Date('2027-06-30'),
        usageLimit: 300,
        timesUsed: 19,
        isActive: true,
      },
      {
        code: 'WELCOME50',
        discountType: 'FIXED',
        discountValue: 100,
        minPurchase: 1000,
        validUntil: new Date('2027-12-31'),
        usageLimit: 1000,
        timesUsed: 88,
        isActive: true,
      }
    ]
  });

  // 7. Orders
  // Customer retail order
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'DEL-2026-1001',
      customerId: customerUser.id,
      orderType: 'RETAIL',
      status: 'DELIVERED',
      subtotal: 3800,
      discount: 300,
      deliveryCharge: 60,
      totalAmount: 3560,
      paymentMethod: 'BKASH',
      paymentStatus: 'PAID',
      paymentTxId: 'BKH9827364102',
      customerName: 'Tanvir Ahmed',
      customerPhone: '+8801812345678',
      customerEmail: 'customer@delied.com',
      shippingAddress: 'House 42, Road 11, Block D, Banani',
      district: 'Dhaka',
      upazila: 'Banani',
      deliveryCourier: 'STEADFAST',
      trackingNumber: 'STF-DH-99281',
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            productName: createdProducts[0].name,
            sku: createdProducts[0].sku,
            price: 2450,
            quantity: 1,
            total: 2450,
            size: 'L (40)',
            color: 'Royal Indigo'
          },
          {
            productId: createdProducts[3].id,
            productName: createdProducts[3].name,
            sku: createdProducts[3].sku,
            price: 1350,
            quantity: 1,
            total: 1350,
            size: 'L',
            color: 'Classic Navy'
          }
        ]
      },
      timeline: {
        create: [
          { status: 'PENDING', note: 'Order placed by customer Tanvir Ahmed' },
          { status: 'CONFIRMED', note: 'bKash automated transaction confirmed (BKH9827364102)' },
          { status: 'PROCESSING', note: 'Packed at Delied Central Warehouse' },
          { status: 'SHIPPED', note: 'Handed over to Steadfast Courier' },
          { status: 'DELIVERED', note: 'Customer signed and acknowledged receipt' }
        ]
      }
    }
  });

  // Reseller Order
  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'DEL-2026-1002',
      customerId: customerUser.id,
      resellerId: resellerUser.resellerProfile.id,
      orderType: 'RESELLER',
      status: 'SHIPPED',
      subtotal: 5400,
      discount: 0,
      deliveryCharge: 120,
      totalAmount: 5520,
      resellerProfit: 800, // custom price 2700 vs reseller price 1950 (x2)
      paymentMethod: 'COD',
      paymentStatus: 'UNPAID',
      customerName: 'Farhana Sultana (Reseller Client)',
      customerPhone: '+8801799887766',
      customerEmail: 'farhana.s@gmail.com',
      shippingAddress: 'Flat 4B, Hillview R/A, Nasirabad',
      district: 'Chittagong',
      upazila: 'Kotwali',
      deliveryCourier: 'PATHAO',
      trackingNumber: 'PTH-CTG-1029',
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            productName: createdProducts[0].name,
            sku: createdProducts[0].sku,
            price: 1950, // base reseller price
            customResellerPrice: 2700, // reseller selling price to customer
            quantity: 2,
            total: 5400,
            size: 'M (38)',
            color: 'Deep Navy'
          }
        ]
      },
      timeline: {
        create: [
          { status: 'PENDING', note: 'Reseller submitted customer dispatch order' },
          { status: 'CONFIRMED', note: 'Admin approved reseller margin allocation' },
          { status: 'SHIPPED', note: 'Shipped via Pathao Courier with COD ৳5520' }
        ]
      }
    }
  });

  // Wholesale bulk order
  const order3 = await prisma.order.create({
    data: {
      orderNumber: 'DEL-2026-1003',
      wholesaleBuyerId: wholesaleUser.wholesaleProfile.id,
      orderType: 'WHOLESALE',
      status: 'PROCESSING',
      subtotal: 87500, // 50 pcs * 1750
      discount: 2500,
      deliveryCharge: 0,
      totalAmount: 85000,
      paymentMethod: 'SSLCOMMERZ',
      paymentStatus: 'PAID',
      paymentTxId: 'SSL-2026-NARG-001',
      customerName: 'Karim Textiles & Apparel Co.',
      customerPhone: '+8801719876543',
      customerEmail: 'wholesale@delied.com',
      shippingAddress: 'Narayanganj Wholesale Hub, 14 Tanbazar',
      district: 'Narayanganj',
      upazila: 'Sadar',
      notes: 'Bulk carton packing required with individual garment poly bags',
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            productName: createdProducts[0].name,
            sku: createdProducts[0].sku,
            price: 1750, // wholesale tier price
            quantity: 50,
            total: 87500,
            size: 'Assorted: 15 M, 20 L, 15 XL',
            color: 'Royal Indigo'
          }
        ]
      },
      timeline: {
        create: [
          { status: 'PENDING', note: 'Wholesale bulk order requisition placed' },
          { status: 'CONFIRMED', note: 'Approved by Super Admin with Tier 1 pricing' },
          { status: 'PROCESSING', note: 'Manufacturing batch completed, final QC check' }
        ]
      }
    }
  });

  // 8. Reseller Wallet transactions
  await prisma.walletTransaction.create({
    data: {
      resellerId: resellerUser.resellerProfile.id,
      type: 'EARNING',
      amount: 1500,
      status: 'COMPLETED',
      reference: 'DEL-2026-0988',
      note: 'Profit earned on delivery of Order DEL-2026-0988',
    }
  });

  await prisma.withdrawalRequest.create({
    data: {
      resellerId: resellerUser.resellerProfile.id,
      amount: 5000,
      method: 'BKASH',
      paymentDetails: 'bKash Personal: 01912345678',
      status: 'PENDING',
      txHash: null,
      reviewedBy: null,
    }
  });

  // 9. Shareholder Records
  await prisma.shareDividend.create({
    data: {
      shareholderId: shareholderUser.shareholderProfile.id,
      fiscalYear: 'FY 2024-2025',
      amount: 150000.0,
      paymentDate: new Date('2025-10-15'),
      status: 'PAID',
      reference: 'DIV-2025-Q4-01',
    }
  });

  await prisma.shareholderDocument.createMany({
    data: [
      {
        title: 'Audited Annual Financial Statement FY 2024-2025 (Rahman & Co Chartered Accountants)',
        description: 'Complete balance sheet, cash flows, and auditor opinion approved at AGM.',
        fileUrl: '/docs/Delied-Audited-Report-FY24-25.pdf',
        category: 'FINANCIAL_REPORT',
      },
      {
        title: 'Minutes of the 3rd Extraordinary General Meeting (EGM)',
        description: 'Resolutions passed regarding factory expansion in Gazipur and dividend distribution.',
        fileUrl: '/docs/EGM-Minutes-Delied-2025.pdf',
        category: 'MEETING_MINUTES',
      }
    ]
  });

  // 10. Support Tickets & Live Chat
  const ticket1 = await prisma.supportTicket.create({
    data: {
      ticketNumber: 'TKT-2026-881',
      customerId: customerUser.id,
      assignedModeratorId: moderatorUser.id,
      subject: 'Inquiry regarding size exchange for Eid Panjabi',
      category: 'RETURN_REFUND',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      messages: {
        create: [
          {
            senderId: customerUser.id,
            senderName: customerUser.name,
            senderRole: 'CUSTOMER',
            message: 'Hello, I received size L (40) but would like to exchange it for XL (42). The product tag is intact. How can I proceed?',
          },
          {
            senderId: moderatorUser.id,
            senderName: moderatorUser.name,
            senderRole: 'MODERATOR',
            message: 'Hello Tanvir! We have arranged a reverse pickup via Steadfast Courier. The courier representative will collect size 40 and hand over size 42 tomorrow.',
          }
        ]
      }
    }
  });

  const chatSession = await prisma.liveChatSession.create({
    data: {
      customerName: 'Shakil Chowdhury',
      customerEmail: 'shakil@gmail.com',
      customerPhone: '01711223344',
      status: 'ACTIVE',
      assignedToName: 'Fatema Tuz Zohra (Moderator)',
      messages: {
        create: [
          {
            senderType: 'CUSTOMER',
            senderName: 'Shakil Chowdhury',
            message: 'Assalamu Alaikum, is the Royal Indigo Panjabi available for same-day delivery in Gulshan?',
          },
          {
            senderType: 'MODERATOR',
            senderName: 'Fatema Tuz Zohra',
            message: 'Walaikum Assalam! Yes, orders placed before 2:00 PM inside Dhaka metro are eligible for express same-day delivery.',
          }
        ]
      }
    }
  });

  // 11. Marketing Campaigns
  const campaign1 = await prisma.campaign.create({
    data: {
      marketerId: marketerUser.marketerProfile.id,
      name: 'Eid Fashion Mega Launch 2026',
      code: 'EID2026_FASHION',
      channel: 'FACEBOOK',
      budget: 50000.0,
      expenses: 32000.0,
      clicks: 4820,
      conversions: 215,
      revenue: 537500.0,
      commissionRate: 6.5,
      startDate: new Date('2026-01-01'),
      status: 'ACTIVE',
    }
  });

  // 12. Product Reviews
  await prisma.productReview.createMany({
    data: [
      {
        productId: createdProducts[0].id,
        customerId: customerUser.id,
        rating: 5,
        comment: 'Outstanding quality! The fabric feels luxurious and the embroidery is subtle yet stunning. Received compliments from everyone at Eid prayers.',
        isApproved: true,
        approvedBy: moderatorUser.id,
      },
      {
        productId: createdProducts[2].id,
        customerId: customerUser.id,
        rating: 5,
        comment: 'Very thick and warm 380 GSM fleece. Fits true to size, perfect for Dhaka winter evenings.',
        isApproved: true,
        approvedBy: moderatorUser.id,
      }
    ]
  });

  // 13. System Settings
  await prisma.setting.createMany({
    data: [
      { key: 'site_name', value: 'DELIED Fashion E-commerce & ERP', description: 'Brand platform title' },
      { key: 'currency', value: 'BDT', description: 'Primary transactional currency' },
      { key: 'usd_exchange_rate', value: '122.50', description: '1 USD in BDT' },
      { key: 'delivery_dhaka', value: '60', description: 'Delivery fee inside Dhaka city' },
      { key: 'delivery_outside_dhaka', value: '120', description: 'Delivery fee outside Dhaka' },
      { key: 'bkash_merchant_number', value: '01811990011', description: 'Official bKash payment merchant number' },
      { key: 'nagad_merchant_number', value: '01811990022', description: 'Official Nagad payment merchant number' },
      { key: 'support_phone', value: '+8809612345678', description: 'Customer care hotline' },
      { key: 'support_email', value: 'support@delied.com', description: 'Official support email' },
    ]
  });

  // 14. Announcements
  await prisma.announcement.createMany({
    data: [
      {
        title: 'New Eid 2026 Panjabi & Saree Collection Now Live!',
        content: 'Explore exclusive handcrafted traditional wear with express delivery across Bangladesh.',
        targetRole: 'ALL',
        isActive: true,
      },
      {
        title: 'Reseller Commission Payout Schedule Notice',
        content: 'All wallet withdrawal requests submitted before Thursday 5 PM will be disbursed via bKash / Bank by Sunday noon.',
        targetRole: 'RESELLER',
        isActive: true,
      },
      {
        title: 'Wholesale Pre-Order Booking Window Closes March 15',
        content: 'Ensure wholesale bulk orders are confirmed to guarantee pre-festival production slot.',
        targetRole: 'WHOLESALE',
        isActive: true,
      }
    ]
  });

  // 15. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      userId: superAdmin.id,
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'System',
      entityId: 'ROOT',
      details: 'DELIED platform seeded with initial production catalog, 8 roles, pricing engine rules, ERP chart of accounts, and financial benchmarks.',
    }
  });

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
