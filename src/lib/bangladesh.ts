export interface DistrictInfo {
  name: string;
  bn: string;
  division: string;
  deliveryCharge: number; // 60 for Dhaka metro, 120 for outside Dhaka
  upazilas: string[];
}

export const BANGLADESH_DISTRICTS: DistrictInfo[] = [
  {
    name: 'Dhaka',
    bn: 'ঢাকা',
    division: 'Dhaka',
    deliveryCharge: 60,
    upazilas: ['Banani', 'Gulshan', 'Dhanmondi', 'Mirpur', 'Uttara', 'Mohammadpur', 'Tejgaon', 'Badda', 'Motijheel', 'Savar', 'Keraniganj', 'Dhamrai']
  },
  {
    name: 'Gazipur',
    bn: 'গাজীপুর',
    division: 'Dhaka',
    deliveryCharge: 120,
    upazilas: ['Gazipur Sadar', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj', 'Tongi']
  },
  {
    name: 'Narayanganj',
    bn: 'নারায়ণগঞ্জ',
    division: 'Dhaka',
    deliveryCharge: 120,
    upazilas: ['Narayanganj Sadar', 'Bandar', 'Araihazar', 'Rupganj', 'Sonargaon']
  },
  {
    name: 'Chittagong',
    bn: 'চট্টগ্রাম',
    division: 'Chittagong',
    deliveryCharge: 120,
    upazilas: ['Kotwali', 'Panchlaish', 'Agrabad', 'Halishahar', 'Sitakunda', 'Mirsharai', 'Patiya', 'Hathazari', 'Raozan']
  },
  {
    name: 'Sylhet',
    bn: 'সিলেট',
    division: 'Sylhet',
    deliveryCharge: 120,
    upazilas: ['Sylhet Sadar', 'Beanibazar', 'Golapganj', 'Zakiganj', 'Kanaighat', 'Balaganj', 'Fenchuganj', 'Biswanath']
  },
  {
    name: 'Rajshahi',
    bn: 'রাজশাহী',
    division: 'Rajshahi',
    deliveryCharge: 120,
    upazilas: ['Boalia', 'Motihar', 'Rajpara', 'Shah Makhdum', 'Paba', 'Godagari', 'Tanore', 'Bagmara']
  },
  {
    name: 'Khulna',
    bn: 'খুলনা',
    division: 'Khulna',
    deliveryCharge: 120,
    upazilas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Rupsha', 'Dighalia', 'Dumuria']
  },
  {
    name: 'Barisal',
    bn: 'বরিশাল',
    division: 'Barisal',
    deliveryCharge: 120,
    upazilas: ['Barisal Sadar', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gournadi', 'Hizla', 'Mehendiganj', 'Wazirpur']
  },
  {
    name: 'Rangpur',
    bn: 'রংপুর',
    division: 'Rangpur',
    deliveryCharge: 120,
    upazilas: ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj']
  },
  {
    name: 'Mymensingh',
    bn: 'ময়মনসিংহ',
    division: 'Mymensingh',
    deliveryCharge: 120,
    upazilas: ['Mymensingh Sadar', 'Muktagachha', 'Fulbaria', 'Trishal', 'Bhaluka', 'Gafargaon', 'Haluaghat', 'Dhobaura']
  },
  {
    name: 'Comilla',
    bn: 'কুমিল্লা',
    division: 'Chittagong',
    deliveryCharge: 120,
    upazilas: ['Comilla Adarsha Sadar', 'Comilla Sadar Dakshin', 'Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chauddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Muradnagar', 'Nangalkot', 'Titas', 'Meghna', 'Monohargonj']
  },
  {
    name: 'Bogra',
    bn: 'বগুড়া',
    division: 'Rajshahi',
    deliveryCharge: 120,
    upazilas: ['Bogra Sadar', 'Adamdighi', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Sahajanpur', 'Sherpur', 'Shibganj', 'Sonatala']
  }
];

export function getDeliveryCharge(districtName: string): number {
  const found = BANGLADESH_DISTRICTS.find(
    (d) => d.name.toLowerCase() === (districtName || '').toLowerCase()
  );
  return found ? found.deliveryCharge : 120;
}
