export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.top}>
          <span style={styles.brand}>CodeLeaf</span>
          {/* <span style={styles.tagline}>Software Solutions & Development</span> */}
        </div>

        <div style={styles.links}>
          <a
            href="https://codeleaf.co.in"
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            Website
          </a>

          <span style={styles.separator}>|</span>

          <a
            href="https://wa.me/918075159094"
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            WhatsApp
          </a>
        </div>

        <div style={styles.copy}>
          © {new Date().getFullYear()} CodeLeaf. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: 48,
    padding: "28px 16px",
    background: "rgba(0,0,0,0.2)",
    color: "#2D120F",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont"
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    textAlign: "center"
  },
  top: {
    marginBottom: 10
  },
  brand: {
    display: "block",
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "0.5px"
  },
  tagline: {
    display: "block",
    fontSize: 13,
    opacity: 0.75,
    marginTop: 2
  },
  links: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    marginBottom: 10,
    flexWrap: "wrap"
  },
  link: {
    color: "#2D120F",
    textDecoration: "none",
    fontWeight: 500
  },
  separator: {
    opacity: 0.4
  },
  copy: {
    fontSize: 12,
    opacity: 0.6
  }
};
