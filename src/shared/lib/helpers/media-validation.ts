// Ограничения медиафайлов согласно документации 360dialog
export const MEDIA_LIMITS = {
  audio: {
    maxSize: 16 * 1024 * 1024, // 16MB
    supportedTypes: [
      "audio/aac",
      "audio/amr",
      "audio/mpeg",
      "audio/mp4",
      "audio/ogg",
    ],
  },
  video: {
    maxSize: 16 * 1024 * 1024, // 16MB
    supportedTypes: ["video/mp4", "video/3gp"],
  },
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    supportedTypes: ["image/jpeg", "image/png"],
  },
  document: {
    maxSize: 100 * 1024 * 1024, // 100MB
    supportedTypes: ["*/*"], // Любые MIME-типы
  },
};

export type MediaType = "audio" | "video" | "image" | "document";

export type MediaValidationResult = {
  error?: string;
  isValid: boolean;
  mediaType?: MediaType;
};

export const validateMediaFile = (file: File): MediaValidationResult => {
  // Определяем тип медиа по MIME-типу
  const mediaType = getMediaType(file.type);

  if (!mediaType) {
    return {
      isValid: false,
      error: `Неподдерживаемый тип файла: ${file.type}`,
    };
  }

  const limits = MEDIA_LIMITS[mediaType];

  // Проверяем размер файла
  if (file.size > limits.maxSize) {
    const maxSizeMB = limits.maxSize / (1024 * 1024);
    return {
      isValid: false,
      error: `Файл слишком большой. Максимальный размер для ${mediaType}: ${maxSizeMB}MB`,
      mediaType,
    };
  }

  // Проверяем тип файла
  if (mediaType === "document") {
    // Для документов принимаем любые типы
    return {
      isValid: true,
      mediaType,
    };
  }

  if (!limits.supportedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Неподдерживаемый тип файла для ${mediaType}: ${file.type}`,
      mediaType,
    };
  }

  return {
    isValid: true,
    mediaType,
  };
};

export const getMediaType = (mimeType: string): null | MediaType => {
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";
  return "document"; // Все остальные типы считаем документами
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getMediaIcon = (mediaType: MediaType): string => {
  switch (mediaType) {
    case "audio":
      return "🎵";
    case "video":
      return "🎬";
    case "image":
      return "🖼️";
    case "document":
      return "📄";
    default:
      return "📎";
  }
};
