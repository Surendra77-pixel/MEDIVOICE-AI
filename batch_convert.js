const fs = require('fs');
const https = require('https');
const path = require('path');

// Title to File Path mapping
const mapping = {
  'Landing Page': 'Landing.jsx',
  'Access Portal': 'auth/Login.jsx',
  'AI Symptom Checker': 'patient/AIChatbot.jsx',
  'Appointment Booking': 'patient/AppointmentBooking.jsx',
  'Doctor Dashboard': 'doctor/DoctorDashboard.jsx',
  'Hospital Finder': 'patient/HospitalFinder.jsx',
  'Patient Dashboard': 'patient/PatientDashboard.jsx',
  'Live Consultation': 'doctor/ConsultationRoom.jsx',
  'Admin Control Center': 'admin/AdminDashboard.jsx',
  'E-Prescription Builder': 'doctor/PrescriptionBuilder.jsx',
  'Patient Medical History Vault': 'patient/MedicalHistory.jsx',
  'Patient Prescriptions List': 'patient/Prescriptions.jsx',
  'Medication Reminders Manager': 'patient/Reminders.jsx',
  'User Settings & Profile': 'patient/Profile.jsx',
  'Doctor Patient Queue': 'doctor/PatientQueue.jsx',
  'Doctor Clinical Notes': 'doctor/ClinicalNotes.jsx',
  'Doctor Schedule Manager': 'doctor/ScheduleManager.jsx',
  'Doctor Analytics': 'doctor/DoctorAnalytics.jsx',
  'Doctor AI Assistant': 'doctor/DoctorAssistant.jsx',
  'Admin User Management': 'admin/UserManagement.jsx',
  'Admin Security Monitor': 'admin/SecurityMonitor.jsx',
  '404 Error Page': 'public/NotFound.jsx',
  'Emergency SOS': 'patient/SOSOverlay.jsx',
  'Forgot Password Flow': 'auth/ForgotPassword.jsx'
};

function downloadHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function convertToJsx(html) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
        html = bodyMatch[1];
    }
    
    html = html.replace(/class=/g, 'className=');
    html = html.replace(/for=/g, 'htmlFor=');
    
    const emptyTags = ['input', 'img', 'hr', 'br', 'meta', 'link'];
    emptyTags.forEach(tag => {
        const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
        html = html.replace(regex, `<${tag}$1 />`);
    });
    
    const svgAttrs = [
        'fill-rule', 'clip-rule', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 
        'stroke-miterlimit', 'fill-opacity', 'stroke-opacity'
    ];
    svgAttrs.forEach(attr => {
        const camelCaseAttr = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
        const regex = new RegExp(attr + '=', 'gi');
        html = html.replace(regex, camelCaseAttr + '=');
    });

    html = html.replace(/<!--[\s\S]*?-->/g, '');
    
    return html;
}

async function run() {
  try {
    const dataPath = 'C:\\Users\\suren\\.gemini\\antigravity\\brain\\7664dc49-af4c-4913-8427-dcbe63768190\\.system_generated\\steps\\1867\\output.txt';
    const jsonStr = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(jsonStr);
    
    if (!data.screens) {
      console.log('No screens found in JSON.');
      return;
    }

    for (const screen of data.screens) {
      const title = screen.title.split(' - ')[0]; // Remove ' - MediVoice AI'
      const relativePath = mapping[title] || mapping[screen.title];
      
      if (!relativePath) {
        console.log(`Skipping unknown screen: ${title}`);
        continue;
      }

      if (!screen.htmlCode || !screen.htmlCode.downloadUrl) {
        console.log(`No download URL for ${title}`);
        continue;
      }

      console.log(`Processing: ${title} -> ${relativePath}...`);
      
      const rawHtml = await downloadHtml(screen.htmlCode.downloadUrl);
      const jsxHtml = convertToJsx(rawHtml);
      
      const componentName = relativePath.split('/').pop().replace('.jsx', '');
      const reactCode = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nconst ${componentName} = () => {\n  return (\n    <>\n      ${jsxHtml}\n    </>\n  );\n};\n\nexport default ${componentName};\n`;
      
      const fullPath = path.join('client', 'src', 'pages', relativePath);
      
      // Ensure directory exists
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(fullPath, reactCode);
      console.log(`✅ Saved ${fullPath}`);
    }
    
    console.log('\\nBatch conversion complete!');
  } catch (e) {
    console.error('Fatal error:', e);
  }
}

run();
