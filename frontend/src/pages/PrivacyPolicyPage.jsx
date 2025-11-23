import React, { useEffect } from 'react';
import './PrivacyPolicyPage.css';

export default function PrivacyPolicyPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="privacy-policy-page">
      {/* Header */}
      <header className="privacy-header">
        <div className="container">
          <button 
            onClick={() => onNavigate('home')} 
            className="back-button"
            aria-label="Back to home"
          >
            ← Back to Home
          </button>
          <h1 className="privacy-title">Privacy Policy & End-User License Agreement</h1>
          <p className="privacy-subtitle">Community Internet Access Platform (CIAP)</p>
          <div className="privacy-meta">
            <span><strong>Effective Date:</strong> November 23, 2025</span>
            <span><strong>Last Updated:</strong> November 23, 2025</span>
            <span><strong>Version:</strong> 1.0</span>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <nav className="toc-container">
        <div className="container">
          <h2 className="toc-title">Table of Contents</h2>
          <div className="toc-grid">
            <button onClick={() => scrollToSection('introduction')}>Introduction</button>
            <button onClick={() => scrollToSection('data-collection')}>1. Data Collection</button>
            <button onClick={() => scrollToSection('data-usage')}>2. How We Use Your Data</button>
            <button onClick={() => scrollToSection('data-sharing')}>3. Data Sharing & Disclosure</button>
            <button onClick={() => scrollToSection('data-security')}>4. Data Security</button>
            <button onClick={() => scrollToSection('your-rights')}>5. Your Rights & Choices</button>
            <button onClick={() => scrollToSection('content-moderation')}>6. Content Moderation</button>
            <button onClick={() => scrollToSection('cookies')}>7. Cookies & Tracking</button>
            <button onClick={() => scrollToSection('children')}>8. Children's Privacy</button>
            <button onClick={() => scrollToSection('data-retention')}>9. Data Retention</button>
            <button onClick={() => scrollToSection('international-transfers')}>10. International Data Transfers</button>
            <button onClick={() => scrollToSection('policy-changes')}>11. Changes to This Policy</button>
            <button onClick={() => scrollToSection('legal-basis')}>12. Legal Basis (POPIA)</button>
            <button onClick={() => scrollToSection('eula')}>13. End-User License Agreement</button>
            <button onClick={() => scrollToSection('contact')}>14. Contact Information</button>
            <button onClick={() => scrollToSection('acknowledgment')}>15. Acknowledgment & Consent</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="privacy-content">
        <div className="container">
          
          {/* Introduction */}
          <section id="introduction" className="privacy-section">
            <h2>Introduction</h2>
            <p>
              Welcome to the Community Internet Access Platform (CIAP). This Privacy Policy and End-User License Agreement ("Agreement") explains how we collect, use, protect, and share your information when you use our platform.
            </p>
            <p>
              CIAP is designed to serve rural South African communities by providing offline-first access to job listings, business directories, skills training, and local notices. We are committed to protecting your privacy and being transparent about our data practices.
            </p>
            <p className="highlight-box">
              <strong>By using CIAP, you agree to the terms outlined in this Agreement. If you do not agree, please do not use the platform.</strong>
            </p>
          </section>

          {/* 1. Data Collection */}
          <section id="data-collection" className="privacy-section">
            <h2>1. Data Collection</h2>
            
            <h3>1.1 What Information We Collect</h3>
            <p>CIAP collects only the minimum information necessary to provide platform functionality:</p>
            
            <h4>Account Information</h4>
            <ul>
              <li><strong>Name:</strong> Your full name for profile identification</li>
              <li><strong>Email Address:</strong> Used for account authentication and important notifications</li>
              <li><strong>Password:</strong> Securely hashed and never stored in plain text</li>
              <li><strong>Community Affiliation:</strong> The community you belong to (e.g., Acornhoek, Hoedspruit, Mbombela)</li>
              <li><strong>User Role:</strong> Your access level (User, Moderator, or Admin)</li>
            </ul>

            <h4>User-Generated Content</h4>
            <ul>
              <li><strong>Job Listings:</strong> Information you post about employment opportunities</li>
              <li><strong>Business Profiles:</strong> Details about your business for the community directory</li>
              <li><strong>Local Notices:</strong> Announcements or information you share with the community</li>
              <li><strong>Skills and Training Materials:</strong> Educational content you contribute</li>
            </ul>

            <h4>Technical Information (Automatically Collected)</h4>
            <ul>
              <li><strong>Login Activity:</strong> Timestamps of when you access the platform</li>
              <li><strong>Content Actions:</strong> Records of content you create, edit, or moderate</li>
              <li><strong>Error Logs:</strong> Technical data to diagnose and fix platform issues</li>
            </ul>

            <h3>1.2 What We DON'T Collect</h3>
            <p>CIAP explicitly does NOT collect:</p>
            <ul className="no-collect-list">
              <li>❌ Browsing history beyond CIAP platform usage</li>
              <li>❌ Location tracking (beyond your stated community affiliation)</li>
              <li>❌ Device fingerprinting or unique identifiers</li>
              <li>❌ Advertising identifiers or tracking cookies</li>
              <li>❌ Social media profile information</li>
              <li>❌ Financial or payment information (platform is free to use)</li>
              <li>❌ Biometric data</li>
              <li>❌ Health information</li>
              <li>❌ Personal communications outside the platform</li>
            </ul>
          </section>

          {/* 2. How We Use Your Data */}
          <section id="data-usage" className="privacy-section">
            <h2>2. How We Use Your Data</h2>
            
            <h3>2.1 Primary Purposes</h3>
            <p>We use your information only for these purposes:</p>

            <h4>Authentication and Account Management</h4>
            <ul>
              <li>Verify your identity when you log in</li>
              <li>Maintain your account settings and preferences</li>
              <li>Recover your account if you forget your password</li>
            </ul>

            <h4>Platform Functionality</h4>
            <ul>
              <li>Display your content to community members</li>
              <li>Enable role-based features (moderation, administration)</li>
              <li>Facilitate communication within your community</li>
            </ul>

            <h4>Platform Improvement</h4>
            <ul>
              <li>Analyze aggregate usage patterns to improve features</li>
              <li>Identify and fix technical issues</li>
              <li>Ensure platform security and stability</li>
            </ul>

            <h3>2.2 What We Will NEVER Do With Your Data</h3>
            <p>CIAP commits to NEVER:</p>
            <ul className="never-list">
              <li>❌ Sell your personal information to third parties</li>
              <li>❌ Share your data with advertisers</li>
              <li>❌ Use your information for purposes beyond platform functionality</li>
              <li>❌ Track you across other websites or applications</li>
              <li>❌ Create advertising profiles based on your behavior</li>
              <li>❌ Share your content outside your designated community without permission</li>
            </ul>
          </section>

          {/* 3. Data Sharing and Disclosure */}
          <section id="data-sharing" className="privacy-section">
            <h2>3. Data Sharing and Disclosure</h2>

            <h3>3.1 Within the Platform</h3>
            
            <h4>Community Visibility</h4>
            <ul>
              <li>Content you create (jobs, businesses, notices) is visible to members of your community</li>
              <li>Your name appears as the author of content you post</li>
              <li>Moderators and Admins can view pending content submissions</li>
            </ul>

            <h4>Role-Based Access</h4>
            <ul>
              <li><strong>Users:</strong> See only approved, public content</li>
              <li><strong>Moderators:</strong> Access pending content for approval in their community</li>
              <li><strong>Admins:</strong> System-wide access for platform management</li>
            </ul>

            <h3>3.2 External Sharing</h3>
            <p>CIAP may share your information only in these limited circumstances:</p>

            <h4>Legal Compliance</h4>
            <ul>
              <li>When required by South African law or valid legal process</li>
              <li>To respond to court orders, subpoenas, or government requests</li>
              <li>To protect CIAP's legal rights or defend against legal claims</li>
            </ul>

            <h4>Safety and Security</h4>
            <ul>
              <li>To prevent fraud, abuse, or illegal activity</li>
              <li>To protect the safety of users or the public</li>
              <li>To investigate security incidents or violations of this Agreement</li>
            </ul>

            <h4>Service Providers</h4>
            <ul>
              <li>With hosting providers (Netlify, Render) necessary for platform operation</li>
              <li>Service providers are contractually required to protect your data and use it only for CIAP services</li>
            </ul>

            <h3>3.3 No Third-Party Advertising</h3>
            <p>
              CIAP does not share your information with advertising networks, data brokers, or marketing companies. There are no third-party advertising trackers on the platform.
            </p>
          </section>

          {/* 4. Data Security */}
          <section id="data-security" className="privacy-section">
            <h2>4. Data Security</h2>

            <h3>4.1 Security Measures</h3>
            <p>CIAP implements industry-standard security practices to protect your information:</p>

            <h4>Encryption and Hashing</h4>
            <ul>
              <li>Passwords are hashed using bcrypt (10 salt rounds) before storage</li>
              <li>All data transmission uses HTTPS encryption</li>
              <li>Database connections are secured with authentication</li>
            </ul>

            <h4>Access Controls</h4>
            <ul>
              <li>Role-based permissions limit who can access what data</li>
              <li>Administrative access is restricted and logged</li>
              <li>Authentication uses JWT tokens with expiration</li>
            </ul>

            <h4>Monitoring and Updates</h4>
            <ul>
              <li>Regular security monitoring for suspicious activity</li>
              <li>Prompt application of security patches and updates</li>
              <li>Error logging to identify and address vulnerabilities</li>
            </ul>

            <h3>4.2 Your Responsibilities</h3>
            <p>You play a critical role in protecting your account:</p>
            <ul>
              <li>Choose a strong password (at least 8 characters)</li>
              <li>Keep your password confidential - never share it with others</li>
              <li>Log out on shared devices to prevent unauthorized access</li>
              <li>Report suspicious activity immediately to platform administrators</li>
            </ul>

            <h3>4.3 Limitations and Breach Notification</h3>
            <p>
              <strong>No System Is Perfect:</strong> While we implement robust security measures, no internet-based platform can guarantee absolute security. CIAP cannot guarantee that unauthorized parties will never gain access to your information.
            </p>
            
            <p><strong>Breach Notification:</strong> If we discover a data breach that may affect your information, we will:</p>
            <ul>
              <li>Notify you via email within 72 hours</li>
              <li>Explain what information was compromised</li>
              <li>Describe steps we're taking to address the breach</li>
              <li>Provide guidance on protecting yourself</li>
            </ul>
          </section>

          {/* 5. Your Rights and Choices */}
          <section id="your-rights" className="privacy-section">
            <h2>5. Your Rights and Choices</h2>

            <h3>5.1 Access and Portability</h3>
            <p>
              <strong>Right to Access:</strong> You can request a copy of all personal information CIAP stores about you. We will provide this in a readable format within 30 days of your request.
            </p>
            <p>
              <strong>Data Portability:</strong> You can download your content (job listings, business profiles, notices) in JSON or CSV format for use elsewhere.
            </p>

            <h3>5.2 Correction and Updates</h3>
            <p>
              <strong>Right to Correct:</strong> You can update your account information at any time through your profile settings. If you notice incorrect information you cannot change yourself, contact platform administrators.
            </p>

            <h3>5.3 Deletion and Account Closure</h3>
            <p>
              <strong>Right to Delete:</strong> You can request complete deletion of your account and associated data. We will:
            </p>
            <ul>
              <li>Remove your account within 30 days of your request</li>
              <li>Delete all personal information from active databases</li>
              <li>Retain only anonymized data for legal compliance or aggregate statistics</li>
            </ul>

            <p><strong>What Happens to Your Content:</strong> When you delete your account:</p>
            <ul>
              <li>Your content (jobs, businesses, notices) will be removed</li>
              <li>Comments or interactions with other users' content may remain but will show "Deleted User" instead of your name</li>
              <li>Legal records required for compliance may be retained in anonymized form</li>
            </ul>

            <h3>5.4 Objection and Restriction</h3>
            <p>
              <strong>Right to Object:</strong> You can object to specific uses of your data. For example:
            </p>
            <ul>
              <li>Opt out of non-essential communications</li>
              <li>Request that certain content not be shared beyond your immediate community</li>
            </ul>
            <p>
              <strong>Right to Restrict:</strong> You can request that we restrict processing of your data while we investigate concerns or disputes.
            </p>

            <h3>5.5 How to Exercise Your Rights</h3>
            <p>To exercise any of these rights:</p>
            <ul>
              <li><strong>Email:</strong> Send requests to the platform administrator email provided on the Contact page</li>
              <li><strong>In-Platform:</strong> Use the "Account Settings" page to update or delete your information</li>
              <li><strong>Response Time:</strong> We will respond to requests within 30 days</li>
            </ul>
          </section>

          {/* 6. Content Moderation Policy */}
          <section id="content-moderation" className="privacy-section">
            <h2>6. Content Moderation Policy</h2>

            <h3>6.1 Community-Based Moderation</h3>
            <p>CIAP uses a community-based moderation system to maintain content quality and safety:</p>

            <h4>Content Approval Process</h4>
            <ol>
              <li>Users submit content (jobs, businesses, notices)</li>
              <li>Submissions enter "Pending" status</li>
              <li>Community Moderators review pending submissions</li>
              <li>Moderators approve or reject based on community standards</li>
              <li>Approved content becomes visible to the community</li>
            </ol>

            <h4>Moderator Authority</h4>
            <ul>
              <li>Moderators are trusted community members selected for their role</li>
              <li>Moderators can approve, reject, or request revisions to content</li>
              <li>Moderators operate within their assigned communities</li>
            </ul>

            <h4>Appeal Process</h4>
            <ul>
              <li>If your content is rejected, you can appeal to platform Administrators</li>
              <li>Administrators review moderation decisions and can override if appropriate</li>
              <li>Appeals are typically resolved within 7 days</li>
            </ul>

            <h3>6.2 Prohibited Content</h3>
            <p>Regardless of community standards, the following content is prohibited and will be removed:</p>

            <h4>Illegal Content</h4>
            <ul>
              <li>Content that violates South African law</li>
              <li>Promotion of illegal activities</li>
              <li>Fraudulent schemes or scams</li>
            </ul>

            <h4>Harmful Content</h4>
            <ul>
              <li>Hate speech or discrimination based on race, ethnicity, religion, gender, sexual orientation, or disability</li>
              <li>Threats of violence or harm to individuals or groups</li>
              <li>Harassment, bullying, or intimidation</li>
            </ul>

            <h4>Misleading Content</h4>
            <ul>
              <li>Deliberately false information intended to deceive</li>
              <li>Misrepresentation of products, services, or job opportunities</li>
              <li>Impersonation of other individuals or organizations</li>
            </ul>

            <h4>Inappropriate Content</h4>
            <ul>
              <li>Sexually explicit material</li>
              <li>Graphic violence or disturbing imagery</li>
              <li>Spam or repetitive low-quality content</li>
            </ul>

            <h3>6.3 Consequences of Violations</h3>
            <p>Users who violate content policies may face:</p>
            <ul>
              <li><strong>Warning:</strong> First-time minor violations receive a warning</li>
              <li><strong>Content Removal:</strong> Violating content is removed from the platform</li>
              <li><strong>Account Suspension:</strong> Temporary loss of posting privileges</li>
              <li><strong>Account Termination:</strong> Permanent removal from the platform for serious or repeated violations</li>
            </ul>
          </section>

          {/* 7. Cookies and Tracking */}
          <section id="cookies" className="privacy-section">
            <h2>7. Cookies and Tracking</h2>

            <h3>7.1 Essential Cookies Only</h3>
            <p>CIAP uses only essential cookies necessary for platform functionality:</p>

            <h4>Authentication Cookie</h4>
            <ul>
              <li>Stores your login session token</li>
              <li>Expires when you log out or after 24 hours</li>
              <li>Required for you to remain logged in</li>
            </ul>

            <h3>7.2 No Third-Party Tracking</h3>
            <p>CIAP does NOT use:</p>
            <ul className="no-tracking-list">
              <li>❌ Analytics cookies (e.g., Google Analytics)</li>
              <li>❌ Advertising cookies</li>
              <li>❌ Social media tracking pixels</li>
              <li>❌ Cross-site tracking of any kind</li>
            </ul>

            <h3>7.3 Your Cookie Choices</h3>
            <p>You can:</p>
            <ul>
              <li>Disable cookies in your browser settings (but this will prevent you from logging in)</li>
              <li>Clear cookies at any time to log out and remove session data</li>
            </ul>
          </section>

          {/* 8. Children's Privacy */}
          <section id="children" className="privacy-section">
            <h2>8. Children's Privacy</h2>

            <h3>8.1 Age Restrictions</h3>
            <p>
              CIAP is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h3>8.2 Parental Notice</h3>
            <p>If you are a parent or guardian and believe your child under 13 has provided information to CIAP:</p>
            <ul>
              <li>Contact platform administrators immediately</li>
              <li>We will delete the account and associated information within 72 hours</li>
            </ul>

            <h3>8.3 Teen Users (13-17)</h3>
            <p>Users aged 13-17 can use CIAP with the understanding that:</p>
            <ul>
              <li>Their content will be visible to community members</li>
              <li>They should have parental guidance when posting personal information</li>
              <li>Parents can request account deletion at any time</li>
            </ul>
          </section>

          {/* 9. Data Retention */}
          <section id="data-retention" className="privacy-section">
            <h2>9. Data Retention</h2>

            <h3>9.1 Active Accounts</h3>
            <p>For active accounts, we retain:</p>
            <ul>
              <li><strong>Account Information:</strong> For the duration of your account</li>
              <li><strong>User Content:</strong> Until you delete it or close your account</li>
              <li><strong>Login Logs:</strong> For 90 days for security purposes</li>
            </ul>

            <h3>9.2 Closed Accounts</h3>
            <p>After account closure:</p>
            <ul>
              <li><strong>Personal Information:</strong> Deleted within 30 days</li>
              <li><strong>Anonymized Aggregate Data:</strong> May be retained for statistical purposes</li>
              <li><strong>Legal Records:</strong> Retained as required by law (typically 7 years)</li>
            </ul>

            <h3>9.3 Backup Systems</h3>
            <p>
              Data may remain in backup systems for up to 90 days after deletion from active databases. Backups are encrypted and not accessible for regular platform operations.
            </p>
          </section>

          {/* 10. International Data Transfers */}
          <section id="international-transfers" className="privacy-section">
            <h2>10. International Data Transfers</h2>

            <h3>10.1 Data Storage Location</h3>
            <p>CIAP data is stored on servers located in:</p>
            <ul>
              <li><strong>Primary:</strong> Cloud hosting services with servers in Europe (Render.com, Netlify)</li>
              <li><strong>Backups:</strong> Encrypted backups may be stored in multiple geographic locations</li>
            </ul>

            <h3>10.2 South African Data Protection</h3>
            <p>
              While data may be stored internationally, CIAP complies with South Africa's Protection of Personal Information Act (POPIA) and ensures that:
            </p>
            <ul>
              <li>International service providers meet equivalent data protection standards</li>
              <li>Data transfers comply with POPIA requirements</li>
              <li>Your rights under South African law are preserved</li>
            </ul>
          </section>

          {/* 11. Changes to This Policy */}
          <section id="policy-changes" className="privacy-section">
            <h2>11. Changes to This Policy</h2>

            <h3>11.1 Notification of Changes</h3>
            <p>We may update this Privacy Policy periodically to reflect:</p>
            <ul>
              <li>Changes in legal requirements</li>
              <li>New platform features</li>
              <li>Improved privacy practices</li>
              <li>User feedback</li>
            </ul>

            <p><strong>How We Notify You:</strong></p>
            <ul>
              <li>Email notification to all registered users 30 days before changes take effect</li>
              <li>In-platform notice displayed prominently when you log in</li>
              <li>Updated "Last Updated" date at the top of this document</li>
            </ul>

            <h3>11.2 Your Options After Changes</h3>
            <p>If you disagree with updated terms:</p>
            <ul>
              <li>You have 30 days to review the changes</li>
              <li>You can delete your account before changes take effect</li>
              <li>Continued use after the effective date constitutes acceptance</li>
            </ul>
          </section>

          {/* 12. Legal Basis for Processing (POPIA Compliance) */}
          <section id="legal-basis" className="privacy-section">
            <h2>12. Legal Basis for Processing (POPIA Compliance)</h2>

            <h3>12.1 Lawful Processing</h3>
            <p>Under the Protection of Personal Information Act (POPIA), we process your information based on:</p>

            <h4>Consent</h4>
            <ul>
              <li>You provide explicit consent when creating an account</li>
              <li>You can withdraw consent by deleting your account</li>
            </ul>

            <h4>Contractual Necessity</h4>
            <ul>
              <li>Processing is necessary to provide the platform services you requested</li>
            </ul>

            <h4>Legitimate Interest</h4>
            <ul>
              <li>We have a legitimate interest in maintaining platform security and preventing abuse</li>
              <li>This interest is balanced against your privacy rights</li>
            </ul>

            <h4>Legal Obligation</h4>
            <ul>
              <li>We may process data to comply with South African law</li>
            </ul>

            <h3>12.2 POPIA Rights</h3>
            <p>Under POPIA, you have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your information (subject to legal retention requirements)</li>
              <li>Object to processing</li>
              <li>Lodge a complaint with the Information Regulator</li>
            </ul>

            <p><strong>Contact for POPIA Concerns:</strong> Information Regulator (South Africa)</p>
            <p>Website: <a href="https://www.justice.gov.za/inforeg/" target="_blank" rel="noopener noreferrer">https://www.justice.gov.za/inforeg/</a></p>
          </section>

          {/* 13. End-User License Agreement */}
          <section id="eula" className="privacy-section">
            <h2>13. End-User License Agreement</h2>

            <h3>13.1 License Grant</h3>
            <p>CIAP grants you a limited, non-exclusive, non-transferable, revocable license to:</p>
            <ul>
              <li>Access and use the platform for personal, non-commercial purposes</li>
              <li>Create and share content within your community</li>
              <li>Use platform features according to your assigned role</li>
            </ul>

            <h3>13.2 Restrictions</h3>
            <p>You may NOT:</p>
            <ul>
              <li>Modify, copy, or reverse-engineer the platform</li>
              <li>Use automated tools (bots, scrapers) to access content</li>
              <li>Attempt to gain unauthorized access to other accounts or platform systems</li>
              <li>Resell, sublicense, or commercially exploit the platform</li>
              <li>Remove or obscure any copyright or proprietary notices</li>
            </ul>

            <h3>13.3 Intellectual Property</h3>
            
            <h4>Platform Ownership</h4>
            <ul>
              <li>CIAP platform design, code, and infrastructure are owned by the project creator</li>
              <li>The platform is provided for educational and community service purposes</li>
            </ul>

            <h4>Your Content</h4>
            <ul>
              <li>You retain ownership of content you create (jobs, businesses, notices)</li>
              <li>By posting content, you grant CIAP a license to display and distribute it within your community</li>
              <li>You can delete your content at any time, which revokes this license</li>
            </ul>

            <h4>Community Contributed Content</h4>
            <ul>
              <li>Other users' content remains their intellectual property</li>
              <li>You may view and interact with community content but not republish it without permission</li>
            </ul>

            <h3>13.4 Disclaimer of Warranties</h3>
            <p>CIAP is provided "AS IS" without warranties of any kind, either express or implied, including:</p>
            <ul>
              <li>No guarantee of uninterrupted access</li>
              <li>No warranty that content is accurate or reliable</li>
              <li>No guarantee of specific results from platform use</li>
            </ul>

            <p><strong>User Responsibility:</strong></p>
            <ul>
              <li>You are responsible for verifying information before relying on it</li>
              <li>Job listings, business information, and notices are user-generated and not verified by CIAP</li>
              <li>CIAP is not liable for the accuracy of user-submitted content</li>
            </ul>

            <h3>13.5 Limitation of Liability</h3>
            <p>To the maximum extent permitted by law:</p>
            <ul>
              <li>CIAP is not liable for indirect, incidental, or consequential damages</li>
              <li>Total liability is limited to the amount you paid to use the platform (currently free, therefore R0)</li>
              <li>CIAP is not responsible for content posted by users or actions taken based on platform information</li>
            </ul>

            <p><strong>Exceptions:</strong> This limitation does not apply to:</p>
            <ul>
              <li>Liability that cannot be excluded under South African law</li>
              <li>Damages caused by our intentional misconduct or gross negligence</li>
            </ul>

            <h3>13.6 Indemnification</h3>
            <p>You agree to indemnify and hold harmless CIAP from claims arising from:</p>
            <ul>
              <li>Your use of the platform</li>
              <li>Content you post</li>
              <li>Your violation of this Agreement</li>
              <li>Your violation of any rights of others</li>
            </ul>

            <h3>13.7 Termination</h3>

            <h4>Your Right to Terminate</h4>
            <ul>
              <li>You can stop using CIAP at any time</li>
              <li>You can delete your account through Account Settings</li>
            </ul>

            <h4>Our Right to Terminate</h4>
            <ul>
              <li>We can suspend or terminate your account for violations of this Agreement</li>
              <li>We can discontinue the platform with 30 days&apos; notice</li>
            </ul>

            <h4>Effect of Termination</h4>
            <ul>
              <li>Your right to use the platform ends immediately</li>
              <li>Your data will be handled according to the Data Retention policy</li>
              <li>Provisions regarding intellectual property, liability, and indemnification survive termination</li>
            </ul>
          </section>

          {/* 14. Contact Information */}
          <section id="contact" className="privacy-section">
            <h2>14. Contact Information</h2>

            <h3>14.1 Questions or Concerns</h3>
            <p>For questions about this Privacy Policy, data practices, or platform usage:</p>
            <div className="contact-box">
              <p>
                <strong>Platform Administrator:</strong> Bavukile Birthwell Vilane
              </p>
              <p>
                <strong>Email:</strong> Available through in-platform Contact page
              </p>
              <p>
                <strong>Response Time:</strong> Within 5 business days
              </p>
            </div>

            <h3>14.2 Data Protection Officer</h3>
            <p>For POPIA-related inquiries or to exercise your data rights:</p>
            <p>Contact the platform administrator with &quot;POPIA Request&quot; in the subject line.</p>

            <h3>14.3 Emergency Security Issues</h3>
            <p>For urgent security concerns (suspected breach, unauthorized access):</p>
            <p>
              Use the &quot;Report Security Issue&quot; feature on the platform or email immediately with &quot;URGENT
              SECURITY&quot; in the subject line.
            </p>
          </section>

          {/* 15. Acknowledgment and Consent */}
          <section id="acknowledgment" className="privacy-section">
            <h2>15. Acknowledgment and Consent</h2>

            <p>By creating an account and using CIAP, you acknowledge that:</p>
            <ul className="acknowledgment-list">
              <li>✅ You have read and understood this Privacy Policy and End-User License Agreement</li>
              <li>✅ You consent to the collection, use, and sharing of your information as described</li>
              <li>✅ You agree to the terms and conditions of the license</li>
              <li>✅ You are at least 13 years of age</li>
              <li>✅ You will use the platform responsibly and in compliance with this Agreement</li>
            </ul>

            <p className="thank-you-message">
              <strong>Thank you for being part of the Community Internet Access Platform community.</strong>
            </p>

            <div className="document-footer">
              <p>
                <strong>Document Version:</strong> 1.0
              </p>
              <p>
                <strong>Effective Date:</strong> November 23, 2025
              </p>
              <p>
                <strong>Last Reviewed:</strong> November 23, 2025
              </p>
            </div>
          </section>

          {/* Appendix: Definitions */}
          <section id="definitions" className="privacy-section">
            <h2>Appendix: Definitions</h2>

            <dl className="definitions-list">
              <dt>Administrator (Admin)</dt>
              <dd>
                Platform user with system-wide management capabilities, including user management and technical
                oversight.
              </dd>

              <dt>Community</dt>
              <dd>
                A geographic area served by CIAP (e.g., Acornhoek, Hoedspruit, Mbombela) with its own content and
                user base.
              </dd>

              <dt>Moderator</dt>
              <dd>Trusted community member with authority to approve or reject content submissions within their community.</dd>

              <dt>Personal Information</dt>
              <dd>Information that identifies you as an individual, as defined by POPIA.</dd>

              <dt>Platform</dt>
              <dd>
                The Community Internet Access Platform (CIAP) including all web interfaces, APIs, and backend
                services.
              </dd>

              <dt>POPIA</dt>
              <dd>South Africa&apos;s Protection of Personal Information Act, 2013, which regulates data protection.</dd>

              <dt>User</dt>
              <dd>Basic platform member who can view approved content and submit content for moderation.</dd>

              <dt>User-Generated Content</dt>
              <dd>Jobs, businesses, notices, and other information created and posted by platform users.</dd>
            </dl>
          </section>
        </div>
      </main>

      {/* Back to Top Button */}
      <button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑ Back to Top
      </button>
    </div>
  );
}