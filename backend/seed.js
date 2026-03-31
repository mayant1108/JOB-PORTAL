const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./src/models/Job');
const User = require('./src/models/User');
const Company = require('./src/models/Company');

dotenv.config();

const sampleJobs = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full Time',
    category: 'Engineering',
    salary: '₹120,000 - ₹150,000',
    description: 'We are looking for an experienced Frontend Developer to join our team. You will be responsible for building and maintaining our web applications using React, TypeScript, and modern web technologies.',
    requirements: [
      '5+ years of experience with React',
      'Strong TypeScript skills',
      'Experience with state management (Redux, Context API)',
      'Familiarity with testing frameworks',
      'Excellent communication skills'
    ],
    tags: ['React', 'TypeScript', 'Frontend', 'JavaScript'],
    logo: '💻',
    isActive: true
  },
  {
    title: 'Backend Engineer',
    company: 'DataFlow',
    location: 'Remote',
    type: 'Full Time',
    category: 'Engineering',
    salary: '₹110,000 - ₹140,000',
    description: 'Join our backend team to build scalable APIs and microservices. Work with Node.js, Express, and MongoDB to create powerful server-side applications.',
    requirements: [
      '3+ years of Node.js experience',
      'Experience with MongoDB and SQL databases',
      'Knowledge of RESTful API design',
      'Experience with cloud services (AWS/GCP)',
      'Strong problem-solving skills'
    ],
    tags: ['Node.js', 'Express', 'MongoDB', 'Backend'],
    logo: '⚙️',
    isActive: true
  },
  {
    title: 'UI/UX Designer',
    company: 'DesignStudio',
    location: 'New York, NY',
    type: 'Full Time',
    category: 'Design',
    salary: '₹90,000 - ₹120,000',
    description: 'We need a talented UI/UX Designer to create beautiful and intuitive user interfaces. You will work closely with product teams to design user-centered experiences.',
    requirements: [
      'Portfolio demonstrating UI/UX skills',
      'Proficiency in Figma or Sketch',
      'Understanding of design systems',
      'Experience with user research',
      'Strong visual design skills'
    ],
    tags: ['UI/UX', 'Figma', 'Design', 'Product'],
    logo: '🎨',
    isActive: true
  },
  {
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Austin, TX',
    type: 'Full Time',
    category: 'Engineering',
    salary: '₹130,000 - ₹160,000',
    description: 'Looking for a DevOps engineer to manage our cloud infrastructure, CI/CD pipelines, and ensure high availability of our services.',
    requirements: [
      'Experience with AWS or GCP',
      'Knowledge of Docker and Kubernetes',
      'CI/CD pipeline expertise',
      'Infrastructure as Code (Terraform)',
      'Strong scripting skills'
    ],
    tags: ['DevOps', 'AWS', 'Docker', 'Kubernetes'],
    logo: '☁️',
    isActive: true
  },
  {
    title: 'Product Manager',
    company: 'InnovateTech',
    location: 'Seattle, WA',
    type: 'Full Time',
    category: 'Engineering',
    salary: '₹100,000 - ₹130,000',
    description: 'Lead product development for our flagship applications. Work with stakeholders to define roadmaps and deliver features that users love.',
    requirements: [
      '3+ years of product management experience',
      'Technical background preferred',
      'Strong analytical skills',
      'Excellent communication',
      'Experience with agile methodologies'
    ],
    tags: ['Product', 'Management', 'Agile', 'Strategy'],
    logo: '📊',
    isActive: true
  },
  {
    title: 'Marketing Specialist',
    company: 'GrowthLabs',
    location: 'Los Angeles, CA',
    type: 'Full Time',
    category: 'Marketing',
    salary: '₹60,000 - ₹80,000',
    description: 'Join our marketing team to develop and execute marketing campaigns across various channels. Drive user acquisition and brand awareness.',
    requirements: [
      '2+ years of marketing experience',
      'Experience with digital marketing',
      'Content creation skills',
      'Analytics and reporting',
      'Social media expertise'
    ],
    tags: ['Marketing', 'Digital', 'Content', 'Social Media'],
    logo: '📢',
    isActive: true
  },
  {
    title: 'Data Scientist',
    company: 'AI Innovations',
    location: 'Boston, MA',
    type: 'Full Time',
    category: 'Engineering',
    salary: '₹140,000 - ₹180,000',
    description: 'Work on cutting-edge AI and machine learning projects. Analyze data, build models, and derive insights to drive business decisions.',
    requirements: [
      'MS/PhD in Computer Science or related field',
      'Experience with ML frameworks (TensorFlow, PyTorch)',
      'Strong Python skills',
      'Knowledge of statistics and probability',
      'Experience with big data technologies'
    ],
    tags: ['Data Science', 'Machine Learning', 'AI', 'Python'],
    logo: '🤖',
    isActive: true
  },
  {
    title: 'Full Stack Developer',
    company: 'WebSolutions',
    location: 'Remote',
    type: 'Contract',
    category: 'Engineering',
    salary: '₹80,000 - ₹100,000',
    description: 'Build end-to-end web applications using modern technologies. Work on varied projects for different clients.',
    requirements: [
      '3+ years of full stack development',
      'React and Node.js experience',
      'Database design skills',
      'Version control (Git)',
      'Good communication skills'
    ],
    tags: ['Full Stack', 'React', 'Node.js', 'Web'],
    logo: '🌐',
    isActive: true
  },
  {
    title: 'Mobile App Developer',
    company: 'AppVenture',
    location: 'Miami, FL',
    type: 'Full Time',
    category: 'Engineering',
    salary: '₹95,000 - ₹125,000',
    description: 'Develop native mobile applications for iOS and Android. Create engaging mobile experiences for our users.',
    requirements: [
      'Experience with React Native or Flutter',
      'Mobile app development portfolio',
      'Knowledge of mobile UI/UX',
      'API integration experience',
      'App store submission experience'
    ],
    tags: ['Mobile', 'React Native', 'iOS', 'Android'],
    logo: '📱',
    isActive: true
  },
  {
    title: 'Junior Web Developer',
    company: 'StartUp Hub',
    location: 'Chicago, IL',
    type: 'Internship',
    category: 'Engineering',
    salary: '₹20 - ₹25/hour',
    description: 'Great opportunity for a junior developer to learn and grow. Work on real projects with experienced mentors.',
    requirements: [
      'Basic HTML, CSS, JavaScript skills',
      'Eagerness to learn',
      'Problem-solving attitude',
      'Teamwork skills',
      'Relevant coursework or bootcamp'
    ],
    tags: ['Junior', 'Web', 'Internship', 'Learning'],
    logo: '💡',
    isActive: true
  }
];

const sampleCompanies = [
  {
    name: 'TechCorp',
    description: 'Leading technology company specializing in enterprise software solutions.',
    industry: 'Technology',
    companySize: '1000+ employees',
    location: 'San Francisco, CA',
    logo: '💻',
    website: 'https://techcorp.example.com'
  },
  {
    name: 'DataFlow',
    description: 'Data analytics and processing platform for modern businesses.',
    industry: 'Technology',
    companySize: '500-1000 employees',
    location: 'Remote',
    logo: '⚙️',
    website: 'https://dataflow.example.com'
  },
  {
    name: 'DesignStudio',
    description: 'Creative design agency focused on digital experiences.',
    industry: 'Design',
    companySize: '50-200 employees',
    location: 'New York, NY',
    logo: '🎨',
    website: 'https://designstudio.example.com'
  },
  {
    name: 'CloudTech',
    description: 'Cloud infrastructure and DevOps solutions provider.',
    industry: 'Technology',
    companySize: '200-500 employees',
    location: 'Austin, TX',
    logo: '☁️',
    website: 'https://cloudtech.example.com'
  },
  {
    name: 'InnovateTech',
    description: 'Innovation-driven tech company building next-gen products.',
    industry: 'Technology',
    companySize: '500-1000 employees',
    location: 'Seattle, WA',
    logo: '📊',
    website: 'https://innovatetech.example.com'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobportal');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Job.deleteMany({});
    await Company.deleteMany({});
    console.log('Cleared existing jobs and companies');

    // Insert sample jobs
    const jobs = await Job.insertMany(sampleJobs);
    console.log(`Inserted ${jobs.length} sample jobs`);

    // Insert sample companies
    const companies = await Company.insertMany(sampleCompanies);
    console.log(`Inserted ${companies.length} sample companies`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

