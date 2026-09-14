require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {}
const {
  Leader,
  Timeline,
  Stat,
  Vision,
  Video,
  Gallery,
  Admin
} = require('../models/Schemas');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leader-portfolio';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding.');

    // Clear existing data
    await Leader.deleteMany({});
    await Timeline.deleteMany({});
    await Stat.deleteMany({});
    await Vision.deleteMany({});
    await Video.deleteMany({});
    await Gallery.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared existing collections.');

    // 1. Create Default Admin User
    const adminPassword = 'Admin@12345';
    // Use 12 rounds of bcrypt
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const defaultAdmin = new Admin({
      username: 'admin@narendramodi.in',
      password: hashedPassword,
      isFirstLogin: true
    });
    await defaultAdmin.save();
    console.log('Created Default Admin Credentials:');
    console.log('Username: admin@narendramodi.in');
    console.log('Password: Admin@12345');

    // 2. Create Leader Profile
    const defaultLeader = new Leader({
      name: 'नरेन्द्र मोदी',
      title: 'प्रधानमंत्री, भारत',
      tagline: 'जन सेवा ही ईश्वर सेवा',
      bio: 'नरेन्द्र दामोदरदास मोदी भारत के 14वें प्रधान मंत्री हैं। वह 2014 से भारत के प्रधान मंत्री पद पर आसीन हैं। इससे पहले वे 2001 से 2014 तक गुजरात के मुख्य मंत्री रहे हैं। वह स्वतंत्र भारत में जन्म लेने वाले पहले प्रधान मंत्री हैं। उनका जीवन राष्ट्र सेवा और जन कल्याण के लिए पूर्णतः समर्पित रहा है।',
      heroImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600', // grayscale placeholder
      collageImages: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500',
        'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500',
        'https://images.unsplash.com/photo-1532375811408-1ab65aa37130?w=500',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500',
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500'
      ]
    });
    await defaultLeader.save();
    console.log('Created Default Leader Profile.');

    // 3. Create Timeline Events
    const timelineData = [
      {
        year: '2001',
        title: 'गुजरात का नेतृत्व',
        description: 'गुजरात के मुख्यमंत्री के रूप में शपथ ली। विनाशकारी भूकंप के बाद नव-निर्माण की शुरुआत की और राज्य को विकास के शिखर पर पहुंचाया।',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500',
        order: 1
      },
      {
        year: '2014',
        title: 'प्रधान सेवक',
        description: 'देश के 14वें प्रधानमंत्री के रूप में कार्यभार संभाला। विकास और समावेशी शासन के एक नए युग का मार्ग प्रशस्त किया।',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500',
        order: 2
      },
      {
        year: '2019',
        title: 'सशक्त और आत्मनिर्भर भारत',
        description: 'प्रचंड बहुमत के साथ पुनः चुने गए। "सबका साथ, सबका विकास, सबका विश्वास" के साथ देश को आत्मनिर्भर बनाने का संकल्प लिया।',
        image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500',
        order: 3
      }
    ];
    await Timeline.insertMany(timelineData);
    console.log('Created Timeline Events.');

    // 4. Create Stats
    const statsData = [
      {
        icon: 'home',
        number: '4 करोड़+',
        label: 'PM Awas Yojana',
        order: 1
      },
      {
        icon: 'shield',
        number: '30 करोड़+',
        label: 'Mudra Loans',
        order: 2
      },
      {
        icon: 'heart',
        number: '$100B+',
        label: 'Direct Benefit Transfer',
        order: 3
      },
      {
        icon: 'check-circle',
        number: '11 करोड़+',
        label: 'Swachh Bharat Toilets',
        order: 4
      }
    ];
    await Stat.insertMany(statsData);
    console.log('Created Stats.');

    // 5. Create Vision items
    const visionData = [
      {
        title: 'आत्मनिर्भर भारत',
        description: 'वैश्विक मंच पर भारतीय विनिर्माण और स्थानीय उद्योगों को बढ़ावा देकर स्वावलंबन हासिल करना।',
        backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500',
        order: 1
      },
      {
        title: 'सुरक्षित भारत',
        description: 'राष्ट्रीय सीमाओं की सुरक्षा और आंतरिक सुरक्षा तंत्र को सशक्त बनाकर नागरिकों को एक सुरक्षित माहौल देना।',
        backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500',
        order: 2
      },
      {
        title: 'एक भारत श्रेष्ठ भारत',
        description: 'सांस्कृतिक एकता और राष्ट्रीय एकीकरण को बढ़ावा देकर देश के सभी राज्यों के बीच सह-अस्तित्व की भावना सुदृढ़ करना।',
        backgroundImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500',
        order: 3
      }
    ];
    await Vision.insertMany(visionData);
    console.log('Created Vision cards.');

    // 6. Create Video Links
    const videoData = [
      {
        youtubeId: 'b3n08Qp-QyA',
        title: 'PM Modi In Parliament | A Historic Speech',
        isFeatured: true,
        description: 'प्रधानमंत्री नरेन्द्र मोदी का संसद में ऐतिहासिक संबोधन, जहां उन्होंने देश के भविष्य का रोडमैप रखा।'
      },
      {
        youtubeId: 'v1vX3xM1kL8',
        title: 'Mann Ki Baat - Independence Special',
        isFeatured: false,
        description: 'मन की बात के इस विशेष संस्करण में देशवासियों के साथ साझा किए गए विचार।'
      }
    ];
    await Video.insertMany(videoData);
    console.log('Created Videos.');

    // 7. Create Gallery items
    const galleryData = [
      {
        imageUrl: 'https://images.unsplash.com/photo-1532375811408-1ab65aa37130?w=500',
        caption: 'देश की जनता के साथ संवाद',
        location: 'वाराणसी, उत्तर प्रदेश',
        year: '2023'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500',
        caption: 'अंतरराष्ट्रीय शिखर सम्मेलन में सहभागिता',
        location: 'नई दिल्ली',
        year: '2023'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500',
        caption: 'स्वच्छ भारत अभियान का शुभारंभ',
        location: 'नई दिल्ली',
        year: '2014'
      }
    ];
    await Gallery.insertMany(galleryData);
    console.log('Created Gallery Photos.');

    console.log('Seeding completed successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
