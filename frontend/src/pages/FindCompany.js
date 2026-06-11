import React, { useState } from 'react';
import axios from 'axios';
import { Card, BackBtn, Input, GreenBtn, InfoField, Loader } from '../components/UI';

export default function FindCompany() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSelected(null);
    try {
      const res = await axios.get(`/api/facilities/search?name=${query}`);
      setResults(res.data);
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (selected) {
    return (
      <Card>
        <BackBtn onClick={() => setSelected(null)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Taken Over By:</div>
            <InfoField value={selected.takenOverBy || 'Nil'} highlight={!!selected.takenOverBy} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Company Name</div>
            <InfoField value={selected.name} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Address:</div>
            <InfoField value={selected.address} />
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Serial No.</div>
            <InfoField value={selected.serialNo} />
          </div>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>Map:</div>
          <div style={{
            width: '100%', height: '300px', borderRadius: '12px', overflow: 'hidden',
            background: '#e8f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid #ddd',
          }}>
            <iframe
              title="map"
              width="100%" height="300"
              style={{ border: 0, borderRadius: '12px' }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${selected.coordinates?.lat || 12.0022},${selected.coordinates?.lng || 8.5919}&z=15&output=embed`}
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '300px', gap: '16px',
      }}>
        {loading ? <Loader /> : (
          <>
            <Input
              placeholder="Station Name"
              value={query}
              onChange={setQuery}
              style={{ maxWidth: '380px' }}
            />
            <GreenBtn
              label={
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  Search
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </span>
              }
              onClick={handleSearch}
              style={{ maxWidth: '380px' }}
            />

            {results !== null && results.length === 0 && (
              <p style={{ color: '#888', fontSize: '14px' }}>No facilities found.</p>
            )}

            {results && results.length > 0 && (
              <div style={{ width: '100%', maxWidth: '500px' }}>
                {results.map(f => (
                  <div
                    key={f._id}
                    onClick={() => setSelected(f)}
                    style={{
                      padding: '14px 18px', borderRadius: '10px', background: '#ebebeb',
                      marginBottom: '8px', cursor: 'pointer', fontWeight: '500',
                      transition: 'background 0.15s',
                    }}
                  >
                    {f.name}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
