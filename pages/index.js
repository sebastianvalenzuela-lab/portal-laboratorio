import fs from 'fs';
import path from 'path';

export async function getServerSideProps({ res }) {
  const filePath = path.join(process.cwd(), 'public', 'index.html');
  const html = fs.readFileSync(filePath, 'utf8');
  res.setHeader('Content-Type', 'text/html');
  res.write(html);
  res.end();
  return { props: {} };
}

export default function Home() {
  return null;
}
