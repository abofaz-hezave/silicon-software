import { ImageResponse } from 'next/og';

export const alt = 'Silicon Software';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: 80,
        background: '#0a0a0a',
        color: '#fafafa',
      }}
    >
      <div style={{ fontSize: 36, opacity: 0.7 }}>Silicon Software</div>
      <div style={{ fontSize: 76, fontWeight: 700, marginTop: 24 }}>Intelligent Briefing</div>
    </div>,
    size,
  );
}

export default OpengraphImage;
