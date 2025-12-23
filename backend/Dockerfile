FROM python:3.11-slim

WORKDIR /app

# 使用腾讯云内网源 (针对腾讯云服务器优化)
RUN sed -i 's/deb.debian.org/mirrors.tencentyun.com/g' /etc/apt/sources.list.d/debian.sources 2>/dev/null || \
    (echo "deb http://mirrors.tencentyun.com/debian/ bookworm main" > /etc/apt/sources.list && \
     echo "deb http://mirrors.tencentyun.com/debian-security/ bookworm-security main" >> /etc/apt/sources.list && \
     echo "deb http://mirrors.tencentyun.com/debian/ bookworm-updates main" >> /etc/apt/sources.list)

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 使用腾讯云 PyPI 镜像加速 pip
RUN pip install --no-cache-dir -r requirements.txt -i https://mirrors.cloud.tencent.com/pypi/simple

# 复制应用代码
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]