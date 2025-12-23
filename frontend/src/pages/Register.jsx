import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
      if (username.length < 2 || username.length > 50) return "用户名长度需在2-50个字符之间";
      if (password.length < 6) return "密码长度至少6位";
      if (!/^1[3-9]\d{9}$/.test(phoneNumber)) return "请输入有效的11位手机号码";
      return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
        setError(validationError);
        return;
    }
    setError('');

    const result = await register(username, password, phoneNumber);
    if (result.success) {
      alert('注册成功！请登录。');
      navigate('/login');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-form">
      <h2>用户注册</h2>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
            <input
            type="text"
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{width: '100%', boxSizing: 'border-box'}}
            />
            <span style={{fontSize: '12px', color: '#666'}}>* 2-50位字符，支持中英文、数字</span>
        </div>
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
            <input
            type="text"
            placeholder="手机号"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={{width: '100%', boxSizing: 'border-box'}}
            />
            <span style={{fontSize: '12px', color: '#666'}}>* 11位手机号码 (一人一号)</span>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
            <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{width: '100%', boxSizing: 'border-box'}}
            />
            <span style={{fontSize: '12px', color: '#666'}}>* 至少6位字符</span>
        </div>

        {error && <div style={{color: 'red', fontSize: '14px'}}>{error}</div>}

        <button type="submit" style={{marginTop: '10px'}}>注册</button>
      </form>
      <Link to="/login" style={{marginTop: '10px'}}>已有账号？去登录</Link>
    </div>
  );
};

export default Register;
