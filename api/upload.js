// Serverless function to securely upload files to GitHub
// Location: api/upload.js

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = process.env.GITHUB_TOKEN;
    const owner = 'inioluwaoluwajemito-netizen';
    const repo = 'Trinsore';

    if (!token) {
        return res.status(500).json({ error: 'GITHUB_TOKEN environment variable is not configured on Vercel.' });
    }

    try {
        const { title, category, alt, fileName, fileData } = req.body;

        if (!title || !category || !alt || !fileName || !fileData) {
            return res.status(400).json({ error: 'Missing required parameters.' });
        }

        const sanitizeFilename = fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
        const filename = `${Date.now()}_${sanitizeFilename}`;
        const imagePath = `assets/images/${filename}`;

        // 1. Upload image to GitHub
        const imgUploadUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${imagePath}`;
        const imgRes = await fetch(imgUploadUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Trinsore-CMS'
            },
            body: JSON.stringify({
                message: `admin: upload portfolio image ${filename}`,
                content: fileData
            })
        });

        if (!imgRes.ok) {
            const errInfo = await imgRes.json();
            throw new Error(`GitHub Image Upload failed: ${errInfo.message || imgRes.statusText}`);
        }

        // 2. Fetch current portfolio.json from GitHub
        const dbUrl = `https://api.github.com/repos/${owner}/${repo}/contents/assets/data/portfolio.json`;
        const dbRes = await fetch(dbUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'Trinsore-CMS'
            }
        });

        if (!dbRes.ok) {
            throw new Error('Failed to fetch portfolio database registry from GitHub.');
        }

        const dbData = await dbRes.json();
        const dbSha = dbData.sha;
        const dbContentText = decodeURIComponent(escape(atob(dbData.content)));
        const currentPortfolio = JSON.parse(dbContentText);

        // 3. Append new item
        const newItem = {
            id: String(currentPortfolio.length + 1),
            title: title,
            category: category,
            image: imagePath,
            alt: alt
        };
        currentPortfolio.push(newItem);

        // 4. Encode and save updated portfolio.json
        const updatedContentBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(currentPortfolio, null, 2))));
        
        const updateRes = await fetch(dbUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'User-Agent': 'Trinsore-CMS'
            },
            body: JSON.stringify({
                message: `admin: add ${title} to portfolio registry`,
                content: updatedContentBase64,
                sha: dbSha
            })
        });

        if (!updateRes.ok) {
            throw new Error('Failed to update portfolio registry JSON on GitHub.');
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Serverless Upload Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
