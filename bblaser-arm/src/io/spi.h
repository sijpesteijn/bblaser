//
// Created by Gijs Sijpesteijn on 26/10/2018.
//

#ifndef BB_LASER_SPI_H
#define BB_LASER_SPI_H

#include <unitypes.h>
#include <fstream>
#include <fcntl.h>

using namespace std;
#define SPIDEV_BYTES_NUM                 8
#define SPIDEV_DATA_BITS_NUM             8
#define SPIDEV_DELAY_US                     0
#define SPI_SS_HIGH                      1
#define SPI_SS_LOW                       0
#define SPI_ONE_BYTE                     1

/* No. of bytes per transaction */
#define NO_OF_BYTES                      2

/*Definitions specific to spidev1.0 */
#define SPIDEV1_PATH                     "/dev/spidev1.0"
#define SPIDEV1_BUS_SPEED_HZ             50000

typedef enum {
    SPI_MODE0 = 0,
    SPI_MODE1 = 1,
    SPI_MODE2 = 2,
    SPI_MODE3 = 3
} SPI_MODE;

typedef struct {
    char *spi_dev_path;
    int fd_spi;
    unsigned long spi_bytes_num;
    unsigned long spi_bus_speedHZ;
    unsigned char ss_change;
    unsigned short spi_delay_us;
    unsigned char spi_data_bits_No;
    unsigned char spi_mode;
} SPI_DeviceT, *SPI_DevicePtr;


class spi {
public:
    spi(int nr);
    ~spi();

    void write8Bits(unsigned char reg, unsigned char value);

    void write12Bits(unsigned char reg, unsigned char value);

private:
    int spi_fd;
    int nr;

    unsigned long bits_per_word = 8; /*!< @brief is used to hold the bits per word size of SPI */
    unsigned char mode = 0; /*!< @brief is used to hold the mode of SPI */
    unsigned long speed = 10000000; /*!< @brief is used to hold the speed of SPI */
    unsigned char flags = O_RDWR;

    void connect();

    int send(unsigned char tx[], unsigned int length);
};


#endif //BB_LASER_SPI_H
