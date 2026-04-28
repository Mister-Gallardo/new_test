import React from "react";

export const Paragraph = ({ children }: { children: React.ReactNode }) => {
  const renderText = (text: string) => {
    const parts = text.split(/(\s+)/);
    return parts.map((part, index) => {
      const cleanPart = part.replace(/[.,;:)]$/, "");
      const suffix = part.slice(cleanPart.length);

      if (cleanPart.startsWith("https://") || cleanPart.startsWith("http://")) {
        return (
          <span key={index}>
            <a href={cleanPart} target="_blank" rel="noopener noreferrer">
              {cleanPart}
            </a>
            {suffix}
          </span>
        );
      }

      if (
        cleanPart.includes("@") &&
        cleanPart.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ) {
        return (
          <span key={index}>
            <a href={`mailto:${cleanPart}`}>{cleanPart}</a>
            {suffix}
          </span>
        );
      }
      return part;
    });
  };

  const processNode = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") {
      return renderText(node);
    }
    if (Array.isArray(node)) {
      return React.Children.map(node, processNode);
    }
    if (React.isValidElement(node)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const props = (node.props as any) || {};
      if (props.children) {
        return React.cloneElement(
          node,
          { ...props },
          processNode(props.children),
        );
      }
      return node;
    }
    return node;
  };

  return (
    <p className="mb-3 text-base leading-6.5 whitespace-pre-line">
      {processNode(children)}
    </p>
  );
};
