# Base image menggunakan Python versi slim untuk ukuran lebih kecil
FROM python:3.10-slim

# Set environment variables untuk memastikan perilaku Python yang dioptimalkan
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Buat direktori kerja di container
WORKDIR /app

# Salin semua file proyek (termasuk requirements.txt dan JSON) ke dalam container
COPY . .

# Install semua dependensi yang diperlukan
RUN pip install --no-cache-dir -r requirements.txt

# Set variabel lingkungan untuk Google Cloud credentials
ENV GOOGLE_APPLICATION_CREDENTIALS="/app/worknonetwork-project-e96dd49d9a07.json"

# Expose port untuk aplikasi
EXPOSE 8000

# Perintah untuk menjalankan aplikasi menggunakan Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
