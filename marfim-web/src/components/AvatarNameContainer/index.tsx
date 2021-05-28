import React, { useCallback, useState } from 'react';
import { Badge, BadgeProps } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { Container } from './styles';

interface AvatarNameContainerProps {
  name: string;
  avatarUrl?: string;
  defaultAvatarIcon: string;
  badge?: BadgeProps;
  showAvatar?: boolean;
  avatarStyle?: object;
  avatarErrorStyle?: object;
}

export const AvatarNameContainer: React.FC<AvatarNameContainerProps> = ({
  avatarUrl,
  avatarStyle,
  avatarErrorStyle,
  name,
  defaultAvatarIcon,
  badge,
  showAvatar = true,
}) => {
  const [isImageError, setIsImageError] = useState(false);

  const onImageError = useCallback((e: React.SyntheticEvent) => {
    setIsImageError(true);
  }, []);

  const defaultStyle = avatarStyle || {
    verticalAlign: 'middle',
    backgroundColor: '#fff',
    borderRadius: '50%',
    boxShadow:
      '2px 2px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.19)',
  };

  const defaultErrorStyle = avatarErrorStyle || {
    verticalAlign: 'middle',
    backgroundColor: '#FBC02D',
    borderRadius: '50%',
    boxShadow:
      '2px 2px 2px 0 rgba(0, 0, 0, 0.1), 0 1px 1px 0 rgba(0, 0, 0, 0.19)',
  };

  if (isImageError) {
    return (
      <Container>
        {showAvatar && (
          <Avatar
            icon="pi pi-exclamation-triangle"
            shape="circle" // not working because of diamond p-avatar
            style={defaultErrorStyle}
          />
        )}
        <span
          style={{
            marginLeft: '1rem',
            verticalAlign: 'middle',
          }}
          className="image-text"
        >
          {name}
          {badge && <Badge className="p-ml-2" {...badge} />}
        </span>
      </Container>
    );
  }

  return (
    <Container>
      {showAvatar && avatarUrl && (
        <Avatar
          image={avatarUrl}
          imageAlt={name}
          shape="circle" // not working because of diamond p-avatar
          style={defaultStyle}
          onImageError={onImageError}
        />
      )}

      {showAvatar && !avatarUrl && (
        <Avatar
          icon={defaultAvatarIcon}
          imageAlt={name}
          shape="circle" // not working because of diamond p-avatar
          style={defaultStyle}
          onImageError={onImageError}
        />
      )}

      <span
        style={{ marginLeft: '1em', verticalAlign: 'middle' }}
        className="image-text"
      >
        {name}
        {badge && <Badge className="p-ml-2" {...badge} />}
      </span>
    </Container>
  );
};
