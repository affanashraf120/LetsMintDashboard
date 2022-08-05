import Link from "next/link";

const Header = () => {
  return (
    <header>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <div className="logo">
              <Link href="/" passHref>
                <a>
                  <img
                    height="40px"
                    alt="Let's Mint"
                    src="/assets/images/logo-icon.png"
                  />
                </a>
              </Link>
            </div>
          </div>
          <div className="col-md-6">
            <div className="code">0x6b8d...2786</div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
